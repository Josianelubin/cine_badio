from django import forms
from .models import Commentaire

class CommentaireForm(forms.ModelForm):
    class Meta:
        model = Commentaire
        fields = ['auteur', 'contenu', 'note']
        widgets = {
            'auteur': forms.TextInput(attrs={'class': 'form-control', 'placeholder': 'Votre nom'}),
            'contenu': forms.Textarea(attrs={'class': 'form-control', 'rows': 4, 'placeholder': 'Votre commentaire...'}),
            'note': forms.Select(attrs={'class': 'form-control'}),
        }
        labels = {
            'auteur': 'Nom',
            'contenu': 'Commentaire',
            'note': 'Note (1-5)',
        }