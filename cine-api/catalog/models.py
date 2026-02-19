from django.db import models
from django.db.models.functions import Now

class Shows(models.Model):
    movie_title = models.CharField(max_length=120, null=False)
    room = models.CharField(max_length=120, null=False)
    price = models.DecimalField(max_digits=10, decimal_places=2, default=0, null=False)
    available_seats = models.IntegerField(null=False)

    def __str__(self):
        return self.movie_title

class Reservations(models.Model):
    show = models.ForeignKey(Shows, on_delete=models.PROTECT, related_name="reservations")
    customer_name = models.CharField(max_length=120, null=False)
    seats = models.IntegerField(null=False)
    class Status(models.TextChoices):
        RESERVED = "reserved", "Reserved"
        CONFIRMED = "confirmed", "Confirmed"
        CANCELLED = "cancelled", "Cancelled"
    status = models.CharField(max_length=20, choices=Status.choices, null=False)
    created_at = models.DateTimeField(db_default=Now())

    def __str__(self):
        return f"{self.show.movie_title} {self.customer_name} ({self.status})"