from django import forms

class NewPostForm(forms.Form):
    content = forms.CharField(widget=forms.Textarea(attrs={'class': 'form-control', 'rows': 2}), label='')

