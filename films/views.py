from django.shortcuts import render, get_object_or_404
from django.http import HttpResponseRedirect
from django.urls import reverse
from .models import Film, Categorie, Commentaire
from .forms import CommentaireForm
from django.db.models import Q

def rechercher_films(request):
    query = request.GET.get('q', '')
    films = []
    
    if query:
        # Recherche dans titre, réalisateur, acteurs
        films = Film.objects.filter(
            Q(titre__icontains=query) |
            Q(realisateur__icontains=query) |
            Q(acteurs__icontains=query) |
            Q(description__icontains=query)
        ).distinct()
    
    context = {
        'films': films,
        'query': query,
    }
    return render(request, 'films/recherche.html', context)

def accueil(request):
    films_populaires = Film.objects.filter(est_populaire=True)[:6]
    derniers_films = Film.objects.order_by('-date_ajout')[:8]
    
    context = {
        'films_populaires': films_populaires,
        'derniers_films': derniers_films,
    }
    return render(request, 'films/accueil.html', context)

def liste_films(request):
    films = Film.objects.all()
    categorie_id = request.GET.get('categorie')
    annee = request.GET.get('annee')
    
    if categorie_id:
        films = films.filter(categorie_id=categorie_id)
    if annee:
        films = films.filter(annee_sortie=annee)
    
    context = {
        'films': films,
        'categories': Categorie.objects.all(),
        'annees': Film.objects.values_list('annee_sortie', flat=True).distinct().order_by('-annee_sortie'),
    }
    return render(request, 'films/liste_films.html', context)

def detail_film(request, film_id):
    film = get_object_or_404(Film, id=film_id)
    commentaires = film.commentaires.all()
    
    if request.method == 'POST':
        form = CommentaireForm(request.POST)
        if form.is_valid():
            commentaire = form.save(commit=False)
            commentaire.film = film
            commentaire.save()
            return HttpResponseRedirect(reverse('detail_film', args=[film_id]))
    else:
        form = CommentaireForm()
    
    context = {
        'film': film,
        'commentaires': commentaires,
        'form': form,
    }
    return render(request, 'films/detail_film.html', context)

def rechercher_films(request):
    query = request.GET.get('q', '')
    films = Film.objects.filter(titre__icontains=query) if query else []
    
    context = {
        'films': films,
        'query': query,
    }
    return render(request, 'films/recherche.html', context)