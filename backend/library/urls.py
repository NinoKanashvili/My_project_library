from django.urls import path
from rest_framework.routers import DefaultRouter
from .views import BookViewSet,BorrowingViewSet,AuthorViewSet,CategoryViewSet,RegisterView,ReviewViewSet

router = DefaultRouter()

router.register(r'books', BookViewSet, basename='book')
router.register(r'borrowing', BorrowingViewSet, basename='borrowing')
router.register(r'authors', AuthorViewSet, basename='author')
router.register(r'categories', CategoryViewSet, basename='category')
router.register(r'reviews', ReviewViewSet, basename='review')


urlpatterns = [
    path('register/',RegisterView.as_view(), name='register'),
    *router.urls
]

