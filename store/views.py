from django.shortcuts import render, get_object_or_404

# Demo products - hardcoded hai, database ki zaroorat nahi is demo store ke liye.
PRODUCTS = [
    {"id": 1, "name": "Ridge Hardshell Jacket", "price": "$189", "category": "Outerwear",
     "description": "Waterproof, windproof shell built for exposed ridgelines and sudden weather changes.",
     "image": "jacket.jpg", "page_value": 22},
    {"id": 2, "name": "Summit Trail Boots", "price": "$149", "category": "Footwear",
     "description": "Ankle-support hiking boots with a Vibram sole, broken in faster than most.",
     "image": "boots.jpg", "page_value": 18},
    {"id": 3, "name": "48L Backcountry Pack", "price": "$219", "category": "Packs",
     "description": "Multi-day pack with a ventilated back panel and rain cover included.",
     "image": "backpack.jpg", "page_value": 26},
    {"id": 4, "name": "Ultralight Tent (2P)", "price": "$329", "category": "Shelter",
     "description": "2-person freestanding tent, packs down to under 3lbs.",
     "image": "tent.jpg", "page_value": 31},
    {"id": 5, "name": "Trail Headlamp", "price": "$39", "category": "Accessories",
     "description": "300-lumen rechargeable headlamp with a red night-vision mode.",
     "image": "headlamp.jpg", "page_value": 6},
    {"id": 6, "name": "Insulated Water Bottle", "price": "$29", "category": "Accessories",
     "description": "Keeps water cold for 24 hours on the trail, hot for 12.",
     "image": "bottle.jpg", "page_value": 4},
]


def home(request):
    return render(request, "store_home.html", {"products": PRODUCTS[:3]})


def shop(request):
    return render(request, "store_shop.html", {"products": PRODUCTS})


def product_detail(request, product_id):
    product = next((p for p in PRODUCTS if p["id"] == product_id), PRODUCTS[0])
    return render(request, "store_product.html", {"product": product, "products": PRODUCTS})


def about(request):
    return render(request, "store_about.html")


def contact(request):
    return render(request, "store_contact.html")


def cart(request):
    cart_items = [PRODUCTS[0], PRODUCTS[2]]
    return render(request, "store_cart.html", {"cart_items": cart_items})


