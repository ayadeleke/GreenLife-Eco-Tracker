from django.test import TestCase
from django.contrib.auth.models import User
from rest_framework.test import APIClient
from .models import TreeEntry
from django.urls import reverse
from datetime import date


class TreeEntryUnitTest(TestCase):
    def setUp(self):
        self.user = User.objects.create_user(
            username="testuser", password="testpass"
        )  # nosec
        self.user2 = User.objects.create_user(
            username="otheruser", password="testpass2"
        )  # nosec
        self.client = APIClient()
        self.client.force_authenticate(user=self.user)
        self.tree_data = {
            "species": "Oak",
            "latitude": 10.0,
            "longitude": 20.0,
            "date_planted": "2025-06-28",
        }

    def test_create_tree_entry(self):
        url = reverse("treeentry-list")
        response = self.client.post(url, self.tree_data, format="json")
        self.assertEqual(response.status_code, 201)
        self.assertEqual(TreeEntry.objects.count(), 1)
        tree = TreeEntry.objects.first()
        self.assertEqual(tree.species, "Oak")
        self.assertEqual(tree.latitude, 10.0)
        self.assertEqual(tree.longitude, 20.0)
        self.assertEqual(tree.user, self.user)

    def test_invalid_latitude(self):
        url = reverse("treeentry-list")
        data = self.tree_data.copy()
        data["latitude"] = 100.0
        response = self.client.post(url, data, format="json")
        self.assertEqual(response.status_code, 400)
        self.assertIn("Latitude must be between -90 and 90.", str(response.data))

    def test_invalid_longitude(self):
        url = reverse("treeentry-list")
        data = self.tree_data.copy()
        data["longitude"] = 200.0
        response = self.client.post(url, data, format="json")
        self.assertEqual(response.status_code, 400)
        self.assertIn("Longitude must be between -180 and 180.", str(response.data))

    def test_duplicate_tree_entry(self):
        url = reverse("treeentry-list")
        self.client.post(url, self.tree_data, format="json")
        response = self.client.post(url, self.tree_data, format="json")
        self.assertEqual(response.status_code, 400)
        self.assertIn(
            "You have already added a tree of this species", str(response.data)
        )

    def test_tree_entry_different_users(self):
        url = reverse("treeentry-list")
        self.client.post(url, self.tree_data, format="json")
        # Authenticate as another user
        self.client.force_authenticate(user=self.user2)
        response = self.client.post(url, self.tree_data, format="json")
        self.assertEqual(response.status_code, 201)
        self.assertEqual(TreeEntry.objects.count(), 2)

    def test_my_stats_endpoint(self):
        # Add multiple trees for stats
        TreeEntry.objects.create(
            user=self.user,
            species="Oak",
            latitude=1,
            longitude=1,
            date_planted=date(2025, 6, 28),
        )
        TreeEntry.objects.create(
            user=self.user,
            species="Maple",
            latitude=2,
            longitude=2,
            date_planted=date(2025, 6, 29),
        )
        TreeEntry.objects.create(
            user=self.user,
            species="Oak",
            latitude=3,
            longitude=3,
            date_planted=date(2025, 6, 30),
        )
        url = reverse("treeentry-my-stats")
        response = self.client.get(url)
        self.assertEqual(response.status_code, 200)
        data = response.json()
        self.assertEqual(data["total_trees"], 3)
        self.assertEqual(data["species_diversity"], 2)
        # Check species_list contains correct counts
        species_counts = {
            item["species"]: item["count"] for item in data["species_list"]
        }
        self.assertEqual(species_counts["Oak"], 2)
        self.assertEqual(species_counts["Maple"], 1)

    def test_my_stats_no_trees(self):
        url = reverse("treeentry-my-stats")
        response = self.client.get(url)
        self.assertEqual(response.status_code, 200)
        data = response.json()
        self.assertEqual(data["total_trees"], 0)
        self.assertEqual(data["species_diversity"], 0)
        self.assertEqual(data["species_list"], [])

    def test_my_stats_one_species(self):
        TreeEntry.objects.create(
            user=self.user,
            species="Oak",
            latitude=1,
            longitude=1,
            date_planted=date(2025, 6, 28),
        )
        TreeEntry.objects.create(
            user=self.user,
            species="Oak",
            latitude=2,
            longitude=2,
            date_planted=date(2025, 6, 29),
        )
        url = reverse("treeentry-my-stats")
        response = self.client.get(url)
        data = response.json()
        self.assertEqual(data["total_trees"], 2)
        self.assertEqual(data["species_diversity"], 1)
        self.assertEqual(data["species_list"][0]["species"], "Oak")
        self.assertEqual(data["species_list"][0]["count"], 2)

    def test_list_tree_entries(self):
        self.client.force_authenticate(user=self.user)
        # Create two trees for the user
        TreeEntry.objects.create(
            user=self.user,
            species="Oak",
            latitude=1,
            longitude=1,
            date_planted=date(2025, 6, 28),
        )
        TreeEntry.objects.create(
            user=self.user,
            species="Maple",
            latitude=2,
            longitude=2,
            date_planted=date(2025, 6, 29),
        )
        url = reverse("treeentry-list")
        response = self.client.get(url)
        self.assertEqual(response.status_code, 200)
        # Only count trees for self.user
        results = (
            response.data["results"] if "results" in response.data else response.data
        )
        self.assertEqual(len(results), 2)
        species = {tree["species"] for tree in results}
        self.assertIn("Oak", species)
        self.assertIn("Maple", species)

    def test_retrieve_tree_entry(self):
        tree = TreeEntry.objects.create(
            user=self.user,
            species="Oak",
            latitude=1,
            longitude=1,
            date_planted=date(2025, 6, 28),
        )
        url = reverse("treeentry-detail", args=[tree.id])
        response = self.client.get(url)
        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.data["species"], "Oak")
        self.assertEqual(response.data["latitude"], 1)
        self.assertEqual(response.data["longitude"], 1)

    def test_update_tree_entry(self):
        tree = TreeEntry.objects.create(
            user=self.user,
            species="Oak",
            latitude=1,
            longitude=1,
            date_planted=date(2025, 6, 28),
        )
        url = reverse("treeentry-detail", args=[tree.id])
        data = {
            "species": "Oak",
            "latitude": 5.0,
            "longitude": 10.0,
            "date_planted": "2025-06-28",
        }
        response = self.client.put(url, data, format="json")
        self.assertEqual(response.status_code, 200)
        tree.refresh_from_db()
        self.assertEqual(tree.latitude, 5.0)
        self.assertEqual(tree.longitude, 10.0)

    def test_partial_update_tree_entry(self):
        tree = TreeEntry.objects.create(
            user=self.user,
            species="Oak",
            latitude=1,
            longitude=1,
            date_planted=date(2025, 6, 28),
        )
        url = reverse("treeentry-detail", args=[tree.id])
        response = self.client.patch(url, {"latitude": 7.0}, format="json")
        self.assertEqual(response.status_code, 200)
        tree.refresh_from_db()
        self.assertEqual(tree.latitude, 7.0)

    def test_delete_tree_entry(self):
        tree = TreeEntry.objects.create(
            user=self.user,
            species="Oak",
            latitude=1,
            longitude=1,
            date_planted=date(2025, 6, 28),
        )
        url = reverse("treeentry-detail", args=[tree.id])
        response = self.client.delete(url)
        self.assertEqual(response.status_code, 204)
        self.assertFalse(TreeEntry.objects.filter(id=tree.id).exists())

    def test_unauthenticated_access_denied(self):
        self.client.force_authenticate(user=None)
        url = reverse("treeentry-list")
        response = self.client.get(url)
        self.assertEqual(response.status_code, 200)

    def test_user_cannot_access_others_tree(self):
        tree = TreeEntry.objects.create(
            user=self.user2,
            species="Birch",
            latitude=0,
            longitude=0,
            date_planted=date(2025, 6, 28),
        )
        url = reverse("treeentry-detail", args=[tree.id])
        response = self.client.get(url)
        self.assertEqual(response.status_code, 200)
        response = self.client.put(
            url,
            {
                "species": "Birch",
                "latitude": 1,
                "longitude": 1,
                "date_planted": "2025-06-28",
            },
            format="json",
        )
        self.assertEqual(response.status_code, 200)
        response = self.client.delete(url)
        self.assertEqual(response.status_code, 204)

    def test_missing_required_fields(self):
        url = reverse("treeentry-list")
        data = {"species": "Oak"}  # Missing lat/lon/date
        response = self.client.post(url, data, format="json")
        self.assertEqual(response.status_code, 400)
        self.assertIn("latitude", response.data)
        self.assertIn("longitude", response.data)
        self.assertIn("date_planted", response.data)

    def test_latitude_longitude_boundaries(self):
        url = reverse("treeentry-list")
        for lat in [-90, 90]:
            data = self.tree_data.copy()
            data["latitude"] = lat
            response = self.client.post(url, data, format="json")
            self.assertEqual(response.status_code, 201)
        for lon in [-180, 180]:
            data = self.tree_data.copy()
            data["longitude"] = lon
            response = self.client.post(url, data, format="json")
            self.assertEqual(response.status_code, 201)
