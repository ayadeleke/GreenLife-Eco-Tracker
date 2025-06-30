from django.contrib.auth.models import User
from django.db import models


class TreeEntry(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    species = models.CharField(max_length=100)
    latitude = models.FloatField()
    longitude = models.FloatField()
    date_planted = models.DateField()
    photo = models.ImageField(upload_to="tree_photos/", null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        constraints = [
            models.UniqueConstraint(
                fields=["user", "species", "latitude", "longitude", "date_planted"],
                name="unique_tree_per_user",
            )
        ]

    def __str__(self):
        return (
            f"{self.species} planted by {self.user.username}"
            f"at ({self.latitude}, {self.longitude})"
        )
