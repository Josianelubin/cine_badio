from datetime import datetime
from .models import Categorie

def annee_actuelle(request):
    from datetime import datetime
    return {
        'annee_actuelle': datetime.now().year,
    }

def categories(request):
    """Context processor séparé pour les catégories"""
    return {
        'categories': Categorie.objects.all()[:5]  
    }