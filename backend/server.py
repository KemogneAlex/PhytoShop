from fastapi import FastAPI, APIRouter, HTTPException, Header, Request, Response, Depends
from fastapi.responses import JSONResponse
from dotenv import load_dotenv
from starlette.middleware.cors import CORSMiddleware
from motor.motor_asyncio import AsyncIOMotorClient
import os
import logging
from pathlib import Path
from pydantic import BaseModel, Field, ConfigDict, EmailStr
from typing import List, Optional, Dict, Any
import uuid
from datetime import datetime, timezone, timedelta
import bcrypt
import jwt
from emergentintegrations.payments.stripe.checkout import StripeCheckout, CheckoutSessionResponse, CheckoutStatusResponse, CheckoutSessionRequest
import requests

ROOT_DIR = Path(__file__).parent
load_dotenv(ROOT_DIR / '.env')

# MongoDB connection
mongo_url = os.environ['MONGO_URL']
client = AsyncIOMotorClient(mongo_url)
db = client[os.environ['DB_NAME']]

# Create the main app without a prefix
app = FastAPI()

# Create a router with the /api prefix
api_router = APIRouter(prefix="/api")

# JWT Config
JWT_SECRET = os.environ.get('JWT_SECRET', 'phytopro-secret-key-2024')
JWT_ALGORITHM = 'HS256'
EMERGENT_AUTH_URL = 'https://demobackend.emergentagent.com/auth/v1/env/oauth/session-data'

# Stripe Config
STRIPE_API_KEY = os.environ.get('STRIPE_API_KEY', 'sk_test_emergent')
STRIPE_SECRET_KEY = os.environ['STRIPE_SECRET_KEY']

# Shipping Config
SHIPPING_COST = float(os.environ.get('SHIPPING_COST', '9.90'))
FREE_SHIPPING_THRESHOLD = float(os.environ.get('FREE_SHIPPING_THRESHOLD', '150.00'))

# ============= Models =============

# User Models
class User(BaseModel):
    model_config = ConfigDict(extra="ignore")
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    email: EmailStr
    name: str
    picture: Optional[str] = None
    password_hash: Optional[str] = None
    is_professional: bool = False
    is_admin: bool = False  # Nouveau champ pour les admins
    certificate_number: Optional[str] = None
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))

class UserSession(BaseModel):
    model_config = ConfigDict(extra="ignore")
    user_id: str
    session_token: str = Field(default_factory=lambda: str(uuid.uuid4()))
    expires_at: datetime
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))

class UserRegister(BaseModel):
    email: EmailStr
    password: str
    name: str
    is_professional: bool = False
    certificate_number: Optional[str] = None

class UserLogin(BaseModel):
    email: EmailStr
    password: str

class SessionData(BaseModel):
    session_id: str

# Product Models
class Product(BaseModel):
    model_config = ConfigDict(extra="ignore")
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    name: str
    slug: str
    category: str
    subcategory: str
    brand: str
    price: float
    amm_number: str
    description: str
    composition: str
    dosage: str
    dangers_ghs: List[str]
    images: List[str]
    stock: int
    is_bio: bool = False
    is_professional_only: bool = False
    featured: bool = False
    rating: float = 0.0
    reviews_count: int = 0
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))

class Category(BaseModel):
    model_config = ConfigDict(extra="ignore")
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    name: str
    slug: str
    icon: str
    description: str

# Cart Models
class CartItem(BaseModel):
    model_config = ConfigDict(extra="ignore")
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    user_id: str
    product_id: str
    quantity: int
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))

class AddToCart(BaseModel):
    product_id: str
    quantity: int = 1

class UpdateCartItem(BaseModel):
    quantity: int

# Order Models
class OrderItem(BaseModel):
    product_id: str
    product_name: str
    quantity: int
    price: float

class ShippingAddress(BaseModel):
    full_name: str
    address: str
    city: str
    postal_code: str
    country: str
    phone: str

class Order(BaseModel):
    model_config = ConfigDict(extra="ignore")
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    user_id: str
    items: List[OrderItem]
    subtotal: float  # Sous-total sans livraison
    shipping_cost: float  # Frais de livraison
    total_amount: float  # Total avec livraison
    status: str = "pending"  # pending, paid, shipped, delivered, cancelled
    shipping_address: ShippingAddress
    payment_session_id: Optional[str] = None
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))

class CreateOrderRequest(BaseModel):
    shipping_address: ShippingAddress
    origin_url: str

# Payment Models
class PaymentTransaction(BaseModel):
    model_config = ConfigDict(extra="ignore")
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    session_id: str
    user_id: Optional[str] = None
    order_id: Optional[str] = None
    amount: float
    currency: str = "eur"
    status: str = "pending"  # pending, completed, failed, expired
    payment_status: str = "unpaid"  # unpaid, paid
    metadata: Optional[Dict[str, Any]] = None
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))

# Review Models
class Review(BaseModel):
    model_config = ConfigDict(extra="ignore")
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    product_id: str
    user_id: str
    user_name: str
    rating: int  # 1-5
    comment: str
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))

class CreateReview(BaseModel):
    product_id: str
    rating: int
    comment: str

# Contact Model
class ContactMessage(BaseModel):
    name: str
    email: EmailStr
    subject: str
    message: str

# Admin Models
class CreateProduct(BaseModel):
    name: str
    slug: str
    category: str
    subcategory: str
    brand: str
    price: float
    amm_number: str
    description: str
    composition: str
    dosage: str
    dangers_ghs: List[str]
    images: List[str]
    stock: int
    is_bio: bool = False
    is_professional_only: bool = False
    featured: bool = False

class UpdateProduct(BaseModel):
    name: Optional[str] = None
    slug: Optional[str] = None
    category: Optional[str] = None
    subcategory: Optional[str] = None
    brand: Optional[str] = None
    price: Optional[float] = None
    amm_number: Optional[str] = None
    description: Optional[str] = None
    composition: Optional[str] = None
    dosage: Optional[str] = None
    dangers_ghs: Optional[List[str]] = None
    images: Optional[List[str]] = None
    stock: Optional[int] = None
    is_bio: Optional[bool] = None
    is_professional_only: Optional[bool] = None
    featured: Optional[bool] = None

# ============= Auth Helpers =============

async def get_session_token(request: Request, authorization: Optional[str] = Header(None)) -> Optional[str]:
    """Get session token from cookie or Authorization header"""
    # Try cookie first
    token = request.cookies.get('session_token')
    if token:
        return token
    
    # Fallback to Authorization header
    if authorization and authorization.startswith('Bearer '):
        return authorization.replace('Bearer ', '')
    
    return None

async def get_current_user(request: Request, authorization: Optional[str] = Header(None)) -> Optional[User]:
    """Get current authenticated user"""
    session_token = await get_session_token(request, authorization)
    if not session_token:
        return None
    
    # Check session in database
    session = await db.user_sessions.find_one({"session_token": session_token})
    if not session:
        return None
    
    # Handle expires_at as datetime or string
    expires_at = session['expires_at']
    if isinstance(expires_at, str):
        expires_at = datetime.fromisoformat(expires_at)
    
    # Make sure both datetimes are timezone-aware
    if expires_at.tzinfo is None:
        expires_at = expires_at.replace(tzinfo=timezone.utc)
    
    if expires_at < datetime.now(timezone.utc):
        return None
    
    # Get user
    user_doc = await db.users.find_one({"id": session['user_id']})
    if not user_doc:
        return None
    
    return User(**user_doc)

async def require_auth(request: Request, authorization: Optional[str] = Header(None)) -> User:
    """Require authentication"""
    user = await get_current_user(request, authorization)
    if not user:
        raise HTTPException(status_code=401, detail="Non authentifié")
    return user

async def require_admin(request: Request, authorization: Optional[str] = Header(None)) -> User:
    """Require admin authentication"""
    user = await require_auth(request, authorization)
    if not user.is_admin:
        raise HTTPException(status_code=403, detail="Accès réservé aux administrateurs")
    return user

def hash_password(password: str) -> str:
    return bcrypt.hashpw(password.encode('utf-8'), bcrypt.gensalt()).decode('utf-8')

def verify_password(password: str, hashed: str) -> bool:
    return bcrypt.checkpw(password.encode('utf-8'), hashed.encode('utf-8'))

# ============= Auth Routes =============

@api_router.post("/auth/register")
async def register(user_data: UserRegister):
    # Check if user exists
    existing = await db.users.find_one({"email": user_data.email})
    if existing:
        raise HTTPException(status_code=400, detail="Cet email est déjà utilisé")
    
    # Create user
    user = User(
        email=user_data.email,
        name=user_data.name,
        password_hash=hash_password(user_data.password),
        is_professional=user_data.is_professional,
        certificate_number=user_data.certificate_number
    )
    
    await db.users.insert_one(user.model_dump())
    
    # Create session
    session = UserSession(
        user_id=user.id,
        expires_at=datetime.now(timezone.utc) + timedelta(days=7)
    )
    await db.user_sessions.insert_one(session.model_dump())
    
    return {"user": user.model_dump(exclude={'password_hash'}), "session_token": session.session_token}

@api_router.post("/auth/login")
async def login(credentials: UserLogin, response: Response):
    # Find user
    user_doc = await db.users.find_one({"email": credentials.email})
    if not user_doc or not user_doc.get('password_hash'):
        raise HTTPException(status_code=401, detail="Email ou mot de passe incorrect")
    
    # Verify password
    if not verify_password(credentials.password, user_doc['password_hash']):
        raise HTTPException(status_code=401, detail="Email ou mot de passe incorrect")
    
    user = User(**user_doc)
    
    # Create session
    session = UserSession(
        user_id=user.id,
        expires_at=datetime.now(timezone.utc) + timedelta(days=7)
    )
    await db.user_sessions.insert_one(session.model_dump())
    
    # Set cookie
    response.set_cookie(
        key="session_token",
        value=session.session_token,
        httponly=True,
        secure=True,
        samesite="none",
        max_age=7*24*60*60,
        path="/"
    )
    
    return {"user": user.model_dump(exclude={'password_hash'}), "session_token": session.session_token}

@api_router.post("/auth/session")
async def process_emergent_session(session_data: SessionData, response: Response):
    """Process Emergent Google OAuth session"""
    try:
        # Get user data from Emergent
        resp = requests.get(
            EMERGENT_AUTH_URL,
            headers={"X-Session-ID": session_data.session_id}
        )
        
        if resp.status_code != 200:
            raise HTTPException(status_code=400, detail="Session invalide")
        
        data = resp.json()
        
        # Check if user exists
        user_doc = await db.users.find_one({"email": data['email']})
        
        if user_doc:
            user = User(**user_doc)
        else:
            # Create new user
            user = User(
                email=data['email'],
                name=data['name'],
                picture=data.get('picture')
            )
            await db.users.insert_one(user.model_dump())
        
        # Create session
        session = UserSession(
            user_id=user.id,
            session_token=data['session_token'],
            expires_at=datetime.now(timezone.utc) + timedelta(days=7)
        )
        await db.user_sessions.insert_one(session.model_dump())
        
        # Set cookie
        response.set_cookie(
            key="session_token",
            value=session.session_token,
            httponly=True,
            secure=True,
            samesite="none",
            max_age=7*24*60*60,
            path="/"
        )
        
        return {"user": user.model_dump(exclude={'password_hash'}), "session_token": session.session_token}
        
    except Exception as e:
        logging.error(f"Erreur auth Emergent: {e}")
        raise HTTPException(status_code=500, detail="Erreur d'authentification")

@api_router.get("/auth/me")
async def get_me(request: Request, authorization: Optional[str] = Header(None)):
    user = await get_current_user(request, authorization)
    if not user:
        raise HTTPException(status_code=401, detail="Non authentifié")
    return user.model_dump(exclude={'password_hash'})

@api_router.post("/auth/logout")
async def logout(request: Request, response: Response, authorization: Optional[str] = Header(None)):
    session_token = await get_session_token(request, authorization)
    if session_token:
        await db.user_sessions.delete_one({"session_token": session_token})
    
    response.delete_cookie(key="session_token", path="/")
    return {"message": "Déconnecté"}

# ============= Product Routes =============

@api_router.get("/products", response_model=List[Product])
async def get_products(
    category: Optional[str] = None,
    subcategory: Optional[str] = None,
    brand: Optional[str] = None,
    is_bio: Optional[bool] = None,
    search: Optional[str] = None,
    min_price: Optional[float] = None,
    max_price: Optional[float] = None,
    skip: int = 0,
    limit: int = 20
):
    query = {}
    if category:
        query['category'] = category
    if subcategory:
        query['subcategory'] = subcategory
    if brand:
        query['brand'] = brand
    if is_bio is not None:
        query['is_bio'] = is_bio
    if search:
        query['$or'] = [
            {'name': {'$regex': search, '$options': 'i'}},
            {'description': {'$regex': search, '$options': 'i'}}
        ]
    if min_price is not None or max_price is not None:
        query['price'] = {}
        if min_price is not None:
            query['price']['$gte'] = min_price
        if max_price is not None:
            query['price']['$lte'] = max_price
    
    products = await db.products.find(query, {"_id": 0}).skip(skip).limit(limit).to_list(limit)
    return products

@api_router.get("/products/featured", response_model=List[Product])
async def get_featured_products():
    products = await db.products.find({"featured": True}, {"_id": 0}).limit(6).to_list(6)
    return products

@api_router.get("/products/{slug}", response_model=Product)
async def get_product(slug: str):
    product = await db.products.find_one({"slug": slug}, {"_id": 0})
    if not product:
        raise HTTPException(status_code=404, detail="Produit non trouvé")
    return product

@api_router.get("/categories", response_model=List[Category])
async def get_categories():
    categories = await db.categories.find({}, {"_id": 0}).to_list(100)
    return categories

# ============= Cart Routes =============

@api_router.get("/cart")
async def get_cart(user: User = Depends(require_auth)):
    cart_items = await db.cart_items.find({"user_id": user.id}, {"_id": 0}).to_list(100)
    
    # Enrich with product data
    enriched_items = []
    for item in cart_items:
        product = await db.products.find_one({"id": item['product_id']}, {"_id": 0})
        if product:
            enriched_items.append({
                **item,
                "product": product
            })
    
    return enriched_items

@api_router.post("/cart/add")
async def add_to_cart(item: AddToCart, user: User = Depends(require_auth)):
    # Check if product exists
    product = await db.products.find_one({"id": item.product_id}, {"_id": 0})
    if not product:
        raise HTTPException(status_code=404, detail="Produit non trouvé")
    
    # Check stock
    if product['stock'] < item.quantity:
        raise HTTPException(status_code=400, detail="Stock insuffisant")
    
    # Check if item already in cart
    existing = await db.cart_items.find_one({"user_id": user.id, "product_id": item.product_id})
    
    if existing:
        # Update quantity
        new_quantity = existing['quantity'] + item.quantity
        if product['stock'] < new_quantity:
            raise HTTPException(status_code=400, detail="Stock insuffisant")
        
        await db.cart_items.update_one(
            {"user_id": user.id, "product_id": item.product_id},
            {"$set": {"quantity": new_quantity}}
        )
    else:
        # Add new item
        cart_item = CartItem(
            user_id=user.id,
            product_id=item.product_id,
            quantity=item.quantity
        )
        await db.cart_items.insert_one(cart_item.model_dump())
    
    return {"message": "Produit ajouté au panier"}

@api_router.put("/cart/update/{item_id}")
async def update_cart_item(item_id: str, update: UpdateCartItem, user: User = Depends(require_auth)):
    # Get cart item
    cart_item = await db.cart_items.find_one({"id": item_id, "user_id": user.id})
    if not cart_item:
        raise HTTPException(status_code=404, detail="Article non trouvé")
    
    # Check stock
    product = await db.products.find_one({"id": cart_item['product_id']}, {"_id": 0})
    if product['stock'] < update.quantity:
        raise HTTPException(status_code=400, detail="Stock insuffisant")
    
    await db.cart_items.update_one(
        {"id": item_id, "user_id": user.id},
        {"$set": {"quantity": update.quantity}}
    )
    
    return {"message": "Panier mis à jour"}

@api_router.delete("/cart/remove/{item_id}")
async def remove_from_cart(item_id: str, user: User = Depends(require_auth)):
    result = await db.cart_items.delete_one({"id": item_id, "user_id": user.id})
    if result.deleted_count == 0:
        raise HTTPException(status_code=404, detail="Article non trouvé")
    return {"message": "Article retiré du panier"}

# ============= Checkout & Payment Routes =============

def calculate_shipping(subtotal: float) -> float:
    """Calculate shipping cost based on subtotal"""
    if subtotal >= FREE_SHIPPING_THRESHOLD:
        return 0.0
    return SHIPPING_COST

@api_router.get("/shipping/calculate")
async def get_shipping_info(subtotal: float):
    """Get shipping information for a given subtotal"""
    shipping_cost = calculate_shipping(subtotal)
    return {
        "shipping_cost": shipping_cost,
        "free_shipping_threshold": FREE_SHIPPING_THRESHOLD,
        "is_free": shipping_cost == 0.0,
        "amount_for_free_shipping": max(0, FREE_SHIPPING_THRESHOLD - subtotal)
    }

@api_router.post("/checkout/create-order")
async def create_order(order_request: CreateOrderRequest, user: User = Depends(require_auth)):
    # Get cart items
    cart_items = await db.cart_items.find({"user_id": user.id}, {"_id": 0}).to_list(100)
    
    if not cart_items:
        raise HTTPException(status_code=400, detail="Panier vide")
    
    # Calculate total and prepare order items
    order_items = []
    subtotal = 0.0
    
    for cart_item in cart_items:
        product = await db.products.find_one({"id": cart_item['product_id']}, {"_id": 0})
        if not product:
            continue
        
        # Check stock
        if product['stock'] < cart_item['quantity']:
            raise HTTPException(status_code=400, detail=f"Stock insuffisant pour {product['name']}")
        
        item_total = product['price'] * cart_item['quantity']
        subtotal += item_total
        
        order_items.append(OrderItem(
            product_id=product['id'],
            product_name=product['name'],
            quantity=cart_item['quantity'],
            price=product['price']
        ))
    
    # Calculate shipping
    shipping_cost = calculate_shipping(subtotal)
    total_amount = subtotal + shipping_cost
    
    # Create order
    order = Order(
        user_id=user.id,
        items=order_items,
        subtotal=subtotal,
        shipping_cost=shipping_cost,
        total_amount=total_amount,
        shipping_address=order_request.shipping_address,
        status="pending"
    )
    
    await db.orders.insert_one(order.model_dump())
    
    # Create Stripe checkout session
    try:
        webhook_url = f"{order_request.origin_url}/api/webhook/stripe"
        stripe_checkout = StripeCheckout(api_key=STRIPE_SECRET_KEY, webhook_url=webhook_url)
        
        success_url = f"{order_request.origin_url}/commande/succes?session_id={{{{CHECKOUT_SESSION_ID}}}}"
        cancel_url = f"{order_request.origin_url}/panier"
        
        checkout_request = CheckoutSessionRequest(
            amount=float(total_amount),
            currency="eur",
            success_url=success_url,
            cancel_url=cancel_url,
            metadata={
                "order_id": order.id,
                "user_id": user.id
            }
        )
        
        session = await stripe_checkout.create_checkout_session(checkout_request)
        
        # Create payment transaction
        payment = PaymentTransaction(
            session_id=session.session_id,
            user_id=user.id,
            order_id=order.id,
            amount=total_amount,
            currency="eur",
            status="pending",
            payment_status="unpaid",
            metadata={"order_id": order.id}
        )
        
        await db.payment_transactions.insert_one(payment.model_dump())
        
        # Update order with payment session
        await db.orders.update_one(
            {"id": order.id},
            {"$set": {"payment_session_id": session.session_id}}
        )
        
        return {"checkout_url": session.url, "session_id": session.session_id, "order_id": order.id}
        
    except Exception as e:
        logging.error(f"Erreur création checkout Stripe: {e}")
        raise HTTPException(status_code=500, detail="Erreur de paiement")

@api_router.get("/checkout/status/{session_id}")
async def get_checkout_status(session_id: str, user: User = Depends(require_auth)):
    try:
        stripe_checkout = StripeCheckout(api_key=STRIPE_SECRET_KEY, webhook_url="")
        status = await stripe_checkout.get_checkout_status(session_id)
        
        # Update payment transaction
        payment = await db.payment_transactions.find_one({"session_id": session_id})
        
        if payment and payment['payment_status'] != 'paid' and status.payment_status == 'paid':
            # Update payment
            await db.payment_transactions.update_one(
                {"session_id": session_id},
                {"$set": {"status": "completed", "payment_status": "paid"}}
            )
            
            # Update order
            order_id = payment.get('order_id')
            if order_id:
                await db.orders.update_one(
                    {"id": order_id},
                    {"$set": {"status": "paid"}}
                )
                
                # Update stock and clear cart
                order = await db.orders.find_one({"id": order_id})
                if order:
                    for item in order['items']:
                        await db.products.update_one(
                            {"id": item['product_id']},
                            {"$inc": {"stock": -item['quantity']}}
                        )
                    
                    # Clear cart
                    await db.cart_items.delete_many({"user_id": user.id})
        
        return status.model_dump()
        
    except Exception as e:
        logging.error(f"Erreur vérification statut: {e}")
        raise HTTPException(status_code=500, detail="Erreur de vérification")

@api_router.post("/webhook/stripe")
async def stripe_webhook(request: Request):
    try:
        body = await request.body()
        signature = request.headers.get("Stripe-Signature")
        
        stripe_checkout = StripeCheckout(api_key=STRIPE_SECRET_KEY, webhook_url="")
        webhook_response = await stripe_checkout.handle_webhook(body, signature)
        
        if webhook_response.payment_status == "paid":
            # Update payment and order
            payment = await db.payment_transactions.find_one({"session_id": webhook_response.session_id})
            
            if payment and payment['payment_status'] != 'paid':
                await db.payment_transactions.update_one(
                    {"session_id": webhook_response.session_id},
                    {"$set": {"status": "completed", "payment_status": "paid"}}
                )
                
                order_id = payment.get('order_id')
                if order_id:
                    await db.orders.update_one(
                        {"id": order_id},
                        {"$set": {"status": "paid"}}
                    )
        
        return {"status": "success"}
        
    except Exception as e:
        logging.error(f"Erreur webhook: {e}")
        return {"status": "error"}

# ============= Order Routes =============

@api_router.get("/orders", response_model=List[Order])
async def get_orders(user: User = Depends(require_auth)):
    orders = await db.orders.find({"user_id": user.id}, {"_id": 0}).sort("created_at", -1).to_list(100)
    return orders

@api_router.get("/orders/{order_id}", response_model=Order)
async def get_order(order_id: str, user: User = Depends(require_auth)):
    order = await db.orders.find_one({"id": order_id, "user_id": user.id}, {"_id": 0})
    if not order:
        raise HTTPException(status_code=404, detail="Commande non trouvée")
    return order

# ============= Review Routes =============

@api_router.get("/reviews/{product_id}", response_model=List[Review])
async def get_reviews(product_id: str):
    reviews = await db.reviews.find({"product_id": product_id}, {"_id": 0}).sort("created_at", -1).to_list(100)
    return reviews

@api_router.post("/reviews")
async def create_review(review: CreateReview, user: User = Depends(require_auth)):
    # Check if product exists
    product = await db.products.find_one({"id": review.product_id})
    if not product:
        raise HTTPException(status_code=404, detail="Produit non trouvé")
    
    # Check if user already reviewed
    existing = await db.reviews.find_one({"product_id": review.product_id, "user_id": user.id})
    if existing:
        raise HTTPException(status_code=400, detail="Vous avez déjà évalué ce produit")
    
    # Create review
    new_review = Review(
        product_id=review.product_id,
        user_id=user.id,
        user_name=user.name,
        rating=review.rating,
        comment=review.comment
    )
    
    await db.reviews.insert_one(new_review.model_dump())
    
    # Update product rating
    all_reviews = await db.reviews.find({"product_id": review.product_id}, {"_id": 0}).to_list(1000)
    avg_rating = sum(r['rating'] for r in all_reviews) / len(all_reviews)
    
    await db.products.update_one(
        {"id": review.product_id},
        {"$set": {"rating": round(avg_rating, 1), "reviews_count": len(all_reviews)}}
    )
    
    return new_review

# ============= Admin Routes =============

@api_router.get("/admin/products", response_model=List[Product])
async def admin_get_all_products(user: User = Depends(require_admin)):
    """Get all products (admin only)"""
    products = await db.products.find({}, {"_id": 0}).to_list(1000)
    return products

@api_router.post("/admin/products", response_model=Product)
async def admin_create_product(product_data: CreateProduct, user: User = Depends(require_admin)):
    """Create a new product (admin only)"""
    # Check if slug already exists
    existing = await db.products.find_one({"slug": product_data.slug})
    if existing:
        raise HTTPException(status_code=400, detail="Un produit avec ce slug existe déjà")
    
    product = Product(
        **product_data.model_dump(),
        rating=0.0,
        reviews_count=0
    )
    
    await db.products.insert_one(product.model_dump())
    return product

@api_router.put("/admin/products/{product_id}", response_model=Product)
async def admin_update_product(
    product_id: str, 
    product_data: UpdateProduct, 
    user: User = Depends(require_admin)
):
    """Update a product (admin only)"""
    # Get existing product
    existing = await db.products.find_one({"id": product_id}, {"_id": 0})
    if not existing:
        raise HTTPException(status_code=404, detail="Produit non trouvé")
    
    # Update only provided fields
    update_data = {k: v for k, v in product_data.model_dump().items() if v is not None}
    
    if update_data:
        await db.products.update_one(
            {"id": product_id},
            {"$set": update_data}
        )
    
    # Return updated product
    updated = await db.products.find_one({"id": product_id}, {"_id": 0})
    return Product(**updated)

@api_router.delete("/admin/products/{product_id}")
async def admin_delete_product(product_id: str, user: User = Depends(require_admin)):
    """Delete a product (admin only)"""
    result = await db.products.delete_one({"id": product_id})
    if result.deleted_count == 0:
        raise HTTPException(status_code=404, detail="Produit non trouvé")
    return {"message": "Produit supprimé avec succès"}

@api_router.get("/admin/stats")
async def admin_get_stats(user: User = Depends(require_admin)):
    """Get admin dashboard statistics"""
    products_count = await db.products.count_documents({})
    users_count = await db.users.count_documents({})
    orders_count = await db.orders.count_documents({})
    
    # Total revenue
    orders = await db.orders.find({"status": "paid"}, {"_id": 0, "total_amount": 1}).to_list(10000)
    total_revenue = sum(order['total_amount'] for order in orders)
    
    # Products by category
    pipeline = [
        {"$group": {"_id": "$category", "count": {"$sum": 1}}}
    ]
    products_by_category = await db.products.aggregate(pipeline).to_list(100)
    
    return {
        "products_count": products_count,
        "users_count": users_count,
        "orders_count": orders_count,
        "total_revenue": total_revenue,
        "products_by_category": products_by_category
    }

# ============= Contact Route =============

@api_router.post("/contact")
async def contact(message: ContactMessage):
    # In production, send email or save to database
    logging.info(f"Contact message from {message.email}: {message.subject}")
    return {"message": "Message envoyé avec succès"}

# Include the router in the main app
app.include_router(api_router)

app.add_middleware(
    CORSMiddleware,
    allow_credentials=True,
    allow_origins=os.environ.get('CORS_ORIGINS', '*').split(','),
    allow_methods=["*"],
    allow_headers=["*"],
)

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)

@app.on_event("shutdown")
async def shutdown_db_client():
    client.close()
