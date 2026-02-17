from django.urls import path
from . import views

urlpatterns = [
    path('', views.accueil, name='accueil'),
    path('films/', views.liste_films, name='liste_films'),
    path('film/<int:film_id>/', views.detail_film, name='detail_film'),
    path('rechercher/', views.rechercher_films, name='rechercher'),
]