# Migration to activate all existing teachers

from django.db import migrations

def activate_teachers(apps, schema_editor):
    Teacher = apps.get_model('main', 'Teacher')
    # Activate all inactive teachers (except those explicitly deactivated by admin)
    Teacher.objects.all().update(active=True)
    print("[MIGRATION] Activated all existing teacher accounts")

def deactivate_teachers(apps, schema_editor):
    # Reverse migration - not recommended to use
    pass

class Migration(migrations.Migration):

    dependencies = [
        ('main', '0012_alter_attendancesession_remove_rtsp_url_and_add_camera_url_port'),
    ]

    operations = [
        migrations.RunPython(activate_teachers, deactivate_teachers),
    ]
