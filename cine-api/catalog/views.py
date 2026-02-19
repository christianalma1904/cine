from rest_framework import viewsets
from rest_framework.permissions import AllowAny
from django_filters.rest_framework import DjangoFilterBackend
from rest_framework.filters import SearchFilter, OrderingFilter
from .models import Shows, Reservations
from .serializers import ShowsSerializer, ReservationsSerializer
from .permissions import IsAdminOrReadOnly

class ShowsViewSet(viewsets.ModelViewSet):
    queryset = Shows.objects.all().order_by("id")
    serializer_class = ShowsSerializer
    permission_classes = [IsAdminOrReadOnly]
    filter_backends = [DjangoFilterBackend, SearchFilter, OrderingFilter]
    search_fields = ["movie_title"]
    ordering_fields = ["id", "movie_title", "room", "price", "available_seats"]

class ReservationsViewSet(viewsets.ModelViewSet):
    queryset = Reservations.objects.select_related("show").all().order_by("-id")
    serializer_class = ReservationsSerializer
    permission_classes = [IsAdminOrReadOnly]
    filter_backends = [DjangoFilterBackend, SearchFilter, OrderingFilter]
    filterset_fields = ["show"]
    search_fields = ["customer_name", "status", "show__movie_title"]
    ordering_fields = ["id", "seats", "customer_name", "status", "created_at"]

    def get_permissions(self):
        # Público: SOLO listar vehículos
        if self.action == "list":
            return [AllowAny()]
        return super().get_permissions()