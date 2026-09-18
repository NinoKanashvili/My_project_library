from django.db import models
from django.contrib.auth.models import User
from django.db.models import Q

class Author(models.Model):
    name = models.CharField(max_length=30)
    biography = models.TextField()
    photo = models.ImageField(upload_to='authors/')

    def __str__(self):
        return self.name


class Category(models.Model):
    name = models.CharField(max_length=30)
    description = models.TextField()

    def __str__(self):
        return self.name


class Book(models.Model):
    title = models.CharField(max_length=200)
    description = models.TextField(blank=True)
    cover_image = models.ImageField(upload_to='covers/',null=True, blank=True)
    author = models.ForeignKey(Author,on_delete=models.CASCADE, related_name='books')
    category = models.ForeignKey(Category, on_delete=models.SET_NULL, null=True, related_name='books')
    published_year = models.PositiveIntegerField()
    total_copies = models.PositiveIntegerField(default=1)
    available_copies = models.PositiveIntegerField(default=1)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        constraints = [
            models.UniqueConstraint(
                fields=['title', 'author'],
                name='unique_book_title_author'
            )
        ]

    def save(self, *args, **kwargs):
        if self._state.adding:
            self.available_copies = self.total_copies

        super().save(*args, **kwargs)

    def __str__(self):
        return self.title


class Borrowing(models.Model):
    user = models.ForeignKey(User,on_delete=models.CASCADE,related_name='borrowings')
    book = models.ForeignKey(Book,on_delete=models.CASCADE,related_name='borrowings')
    borrowed_at = models.DateTimeField(auto_now_add=True)
    due_date = models.DateField()
    returned_at = models.DateTimeField(null=True, blank=True)

    class Meta:
        constraints = [
            models.UniqueConstraint(
                fields=['user','book'],
                condition=Q(returned_at__isnull=True),
                name='unique_active_user_book_borrowing'
            )
        ]

    def __str__(self):
        return f"{self.user.username} - {self.book.title}"


class Review(models.Model):
    user = models.ForeignKey(User,on_delete=models.CASCADE,related_name='reviews')
    book = models.ForeignKey(Book,on_delete=models.CASCADE,related_name='reviews')
    rating = models.PositiveIntegerField()
    comment = models.TextField(blank=True)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.user.username} - {self.book.title}"
