from rest_framework import serializers
from django.contrib.auth.models import User
from .models import Author,Category,Book, Borrowing, Review
from django.utils import timezone
from datetime import timedelta
import re
from django.contrib.auth.password_validation import validate_password


class RegisterSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['username', 'email', 'password']
        extra_kwargs = {
            'password' : {'write_only':True}
        }
    
    def create(self,validated_data):
        return User.objects.create_user(**validated_data)
    
    def validate_email(self, value):
        if User.objects.filter(email=value).exists():
            raise serializers.ValidationError( 'A user with this email already exists.')
        return value

    def validate_username(self, value):
        if not re.search('[A-Z]',value):
            raise serializers.ValidationError(
                'Username must contain at least one uppercase letter.'
            )
        if not re.search('[0-9]',value):
            raise serializers.ValidationError(
                'Username must contain a number.'
            )
        return value
    
    def validate_password(self,value):
        validate_password(value)
        return value

class AuthorSerializer(serializers.ModelSerializer):
    class Meta:
        model = Author
        fields = ['id', 'name', 'biography', 'photo']
        read_only_fields = ['id']

class CategorySerializer(serializers.ModelSerializer):
    class Meta:
        model = Category
        fields = ['id', 'name', 'description']
        read_only_fields = ['id']

class BookSerializer(serializers.ModelSerializer):
    author_details = AuthorSerializer(
        source='author',
        read_only=True
    )
    category_details = CategorySerializer(
        source = 'category',
        read_only=True
    )

    class Meta:
        model = Book
        fields = [
            'id',
            'title',
            'description',
            'cover_image',
            'author',
            'category',
            'published_year',
            'total_copies',
            'available_copies',
            'created_at',
            'author_details',
            'category_details'
        ]
        read_only_fields = [
            'id',
            'available_copies',
            'created_at',
        ]

class BorrowingSerializer(serializers.ModelSerializer):
    book_title = serializers.CharField(
        source='book.title',
        read_only=True
    )
    class Meta:
        model = Borrowing
        fields = [
            'id',
            'user',
            'book',
            'borrowed_at',
            'due_date',
            'returned_at',
            'book_title',
        ]
        read_only_fields = [
            'id',
            'user',
            'borrowed_at',
            'returned_at',
        ]

    def validate_due_date(self,value):
        today = timezone.now().date()

        if value <= today:
            raise serializers.ValidationError('Due date must be in the future.')
        
        if value >= today + timedelta(days=30):
            raise serializers.ValidationError('Due date cannot be more than 30 days from today.')
        
        return value


class ReviewSerializer(serializers.ModelSerializer):
    username = serializers.CharField(source='user.username', read_only=True)
    class Meta:
        model = Review
        fields = [
            'id',
            'username',
            'user',
            'book',
            'rating',
            'comment',
            'created_at',
        ]
        read_only_fields = [
            'id',
            'user',
            'username',
            'created_at',
        ]
    def validate_rating(self, value):
        if value < 1 or value > 5:
            raise serializers.ValidationError(
                'Rating must be between 1 and 5.'
            )
        return value

    
