from django.shortcuts import render
from rest_framework.viewsets import ModelViewSet
from .serializers import BookSerializer,AuthorSerializer,CategorySerializer,BorrowingSerializer,RegisterSerializer,ReviewSerializer
from .models import Book,Author,Category,Borrowing,Review
from .permissions import IsAdminOrReadOnly,IsOwnerOrReadOnly
from rest_framework import serializers
from rest_framework.response import Response
from rest_framework.decorators import action
from django.utils import timezone
from rest_framework.permissions import IsAuthenticated
from rest_framework.generics import CreateAPIView
from rest_framework.filters import SearchFilter, OrderingFilter
from django_filters.rest_framework import DjangoFilterBackend
from .filters import BookFilter


class RegisterView(CreateAPIView):
    serializer_class = RegisterSerializer
    
class BookViewSet(ModelViewSet):
    queryset = Book.objects.all()
    serializer_class = BookSerializer
    permission_classes = [IsAdminOrReadOnly]

    filter_backends = [SearchFilter, DjangoFilterBackend, OrderingFilter]
    search_fields = ['title']
    filterset_class = BookFilter
    ordering_fields = ['title', 'published_year', 'created_at']

class AuthorViewSet(ModelViewSet):
    queryset = Author.objects.all()
    serializer_class = AuthorSerializer
    permission_classes = [IsAdminOrReadOnly]
    pagination_class = None

class CategoryViewSet(ModelViewSet):
    queryset = Category.objects.all()
    serializer_class = CategorySerializer
    permission_classes = [IsAdminOrReadOnly]
    pagination_class = None

class BorrowingViewSet(ModelViewSet):
    serializer_class = BorrowingSerializer
    permission_classes = [IsAuthenticated]
    pagination_class = None

    def get_queryset(self):
        queryset = Borrowing.objects.filter(
            user=self.request.user,
            returned_at__isnull=True
        )

        book_id = self.request.query_params.get('book')

        if book_id:
            queryset = queryset.filter(book_id=book_id)

        return queryset
    
    def perform_create(self, serializer):
        book = serializer.validated_data['book']

        existing_borrowing = Borrowing.objects.filter(
            user=self.request.user,
            book=book,
            returned_at__isnull=True
        ).exists()

        if existing_borrowing:
            raise serializers.ValidationError('You have already borrowed this book.')

        if book.available_copies <= 0:
            raise serializers.ValidationError('This book is not available.')

        book.available_copies -= 1
        book.save()

        serializer.save(user=self.request.user)

    @action(detail=True , methods=['get','post'])
    def return_book(self, request, pk=None):
        borrowing = self.get_object()

        if borrowing.returned_at is not None:
            raise serializers.ValidationError('This book has already been returned.')
        
        borrowing.returned_at = timezone.now()
        borrowing.save()

        book = borrowing.book
        book.available_copies += 1
        book.save()

        return Response({
            'detail': 'Book returned successfully.'
        })

class ReviewViewSet(ModelViewSet):
    queryset = Review.objects.all()
    serializer_class = ReviewSerializer
    permission_classes = [IsOwnerOrReadOnly]

    def get_queryset(self):
        queryset = Review.objects.all()

        book_id = self.request.query_params.get('book')

        if book_id:
            queryset = queryset.filter(book_id=book_id)

        return queryset
    
    def perform_create(self, serializer):
        serializer.save(user = self.request.user)




