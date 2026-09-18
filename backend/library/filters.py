import django_filters
from .models import Book

class BookFilter(django_filters.FilterSet):
    year_min = django_filters.NumberFilter(
        field_name = 'published_year',
        lookup_expr = 'gte'
    )

    year_max = django_filters.NumberFilter(
        field_name = 'published_year',
        lookup_expr = 'lte'
    )

    available = django_filters.BooleanFilter(
        method = 'filter_available',
        label='Available'
    )

    def filter_available(self, queryset, name, value):
        if value:
            return queryset.filter(available_copies__gt=0)
        return queryset.filter(available_copies=0)
    
    class Meta:
        model = Book
        fields = [
            'author',
            'category',
            'year_min',
            'year_max',
            'available',
        ]
