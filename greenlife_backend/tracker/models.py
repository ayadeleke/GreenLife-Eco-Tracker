from django.contrib.auth.models import User
from django.db import models


class TreeEntry(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, db_index=True)
    species = models.CharField(max_length=100, db_index=True)
    latitude = models.FloatField()
    longitude = models.FloatField()
    date_planted = models.DateField(db_index=True)
    photo = models.ImageField(upload_to="tree_photos/", null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        indexes = [
            models.Index(fields=["user", "date_planted"]),
            models.Index(fields=["species", "date_planted"]),
            models.Index(fields=["latitude", "longitude"]),
            models.Index(fields=["-date_planted"]),  # For ordering
        ]
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
