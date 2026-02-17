from django.db import models
from django.urls import reverse

class Categorie(models.Model):
    nom = models.CharField(max_length=100)
    description = models.TextField(blank=True)
    
    class Meta:
        verbose_name = "Catégorie"
        verbose_name_plural = "Catégories"
    
    def __str__(self):
        return self.nom

class Film(models.Model):
    titre = models.CharField(max_length=200)
    realisateur = models.CharField(max_length=200)
    acteurs = models.TextField()
    annee_sortie = models.IntegerField()
    duree = models.IntegerField(help_text="Durée en minutes")
    description = models.TextField()
    poster = models.ImageField(upload_to='films/posters/')
    video = models.FileField(upload_to='films/videos/', blank=True, null=True)
    video_url = models.URLField(blank=True, null=True, help_text="Lien YouTube ou Vimeo")
    categorie = models.ForeignKey(Categorie, on_delete=models.SET_NULL, null=True)
    date_ajout = models.DateTimeField(auto_now_add=True)
    est_populaire = models.BooleanField(default=False)
    note = models.DecimalField(max_digits=3, decimal_places=1, default=0.0)
    
    class Meta:
        verbose_name = "Film"
        verbose_name_plural = "Films"
    
    def __str__(self):
        return self.titre
    
    def get_absolute_url(self):
        return reverse('detail_film', args=[str(self.id)])

class Commentaire(models.Model):
    film = models.ForeignKey(Film, on_delete=models.CASCADE, related_name='commentaires')
    auteur = models.CharField(max_length=100)
    contenu = models.TextField()
    date = models.DateTimeField(auto_now_add=True)
    note = models.IntegerField(choices=[(i, i) for i in range(1, 6)])
    
    class Meta:
        ordering = ['-date']