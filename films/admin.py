from django.contrib import admin
from .models import Film, Categorie, Commentaire

@admin.register(Categorie)
class CategorieAdmin(admin.ModelAdmin):
    list_display = ['nom', 'description']
    search_fields = ['nom']

@admin.register(Film)
class FilmAdmin(admin.ModelAdmin):
    list_display = ['titre', 'realisateur', 'annee_sortie', 'categorie', 'note', 'est_populaire']
    list_filter = ['annee_sortie', 'categorie', 'est_populaire']
    search_fields = ['titre', 'realisateur']
    readonly_fields = ['date_ajout']
    fieldsets = (
        ('Informations générales', {
            'fields': ('titre', 'realisateur', 'acteurs', 'annee_sortie', 'duree', 'categorie')
        }),
        ('Description', {
            'fields': ('description',)
        }),
        ('Médias', {
            'fields': ('poster', 'video', 'video_url')
        }),
        ('Évaluation', {
            'fields': ('note', 'est_populaire')
        }),
        ('Dates', {
            'fields': ('date_ajout',)
        }),
    )

@admin.register(Commentaire)
class CommentaireAdmin(admin.ModelAdmin):
    list_display = ['auteur', 'film', 'note', 'date']
    list_filter = ['note', 'date']
    search_fields = ['auteur', 'contenu']