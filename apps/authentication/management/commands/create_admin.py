import os

from django.core.management.base import BaseCommand
from django.contrib.auth import get_user_model


class Command(BaseCommand):
    help = "Crée ou met à jour le compte administrateur depuis les variables d'environnement."

    def handle(self, *args, **options):
        User = get_user_model()

        username = os.environ.get("ADMIN_USERNAME")
        email = os.environ.get("ADMIN_EMAIL")
        password = os.environ.get("ADMIN_PASSWORD")

        if not username:
            self.stdout.write(
                self.style.ERROR("ADMIN_USERNAME n'est pas défini.")
            )
            return

        if not email:
            self.stdout.write(
                self.style.ERROR("ADMIN_EMAIL n'est pas défini.")
            )
            return

        if not password:
            self.stdout.write(
                self.style.ERROR("ADMIN_PASSWORD n'est pas défini.")
            )
            return

        user, created = User.objects.get_or_create(
            username=username,
            defaults={
                "email": email,
                "first_name": "Administrateur",
                "last_name": "TaxoMètre",
                "role": "admin",
                "is_staff": True,
                "is_superuser": True,
                "is_active": True,
                "is_verified": True,
            },
        )

        user.email = email
        user.role = "admin"
        user.is_staff = True
        user.is_superuser = True
        user.is_active = True
        user.is_verified = True
        user.set_password(password)
        user.save()

        if created:
            self.stdout.write(
                self.style.SUCCESS(
                    f"Administrateur '{username}' créé avec succès."
                )
            )
        else:
            self.stdout.write(
                self.style.SUCCESS(
                    f"Administrateur '{username}' mis à jour avec succès."
                )
            )
