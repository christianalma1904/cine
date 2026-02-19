from rest_framework import serializers

class MovieCatalogSerializer(serializers.Serializer):
    movie_title = serializers.CharField(max_length=120)
    genre = serializers.CharField(required=False, allow_blank=True)
    duration_min = serializers.FloatField(required=False)
    is_active = serializers.BooleanField(default=True)

class ReservationEventsSerializer(serializers.Serializer):
    _id = serializers.IntegerField(read_only=True)
    reservation_id = serializers.IntegerField()        # ID de Vehiculo (Postgres)
    class Event:
        CREATED = "created"
        CONFIRMED = "confirmed"
        CANCELLED = "cancelled"
        CHECKED_IN = "checked_in"

        CHOICES = [
            (CREATED, "Created"),
            (CONFIRMED, "Confirmed"),
            (CANCELLED, "Cancelled"),
            (CHECKED_IN, "Checked In")
        ]
    event_type = serializers.ChoiceField(choices=Event.CHOICES, default=Event.CHECKED_IN)       # ObjectId (string) de service_types
    class Source:
        WEB = "web"
        MOBILE = "mobile"
        SYSTEM = "system"

        CHOICES = [
            (WEB, "Web"),
            (MOBILE, "Mobile"),
            (SYSTEM, "System")
        ]
    source = serializers.ChoiceField(choices=Source.CHOICES, default=Source.SYSTEM)    # Ej: 2026-02-04
    note = serializers.CharField(max_length=120)
    created_at = serializers.DateField(required=False)