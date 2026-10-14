# Migration to create missing teacher profiles for existing users

from django.db import migrations

def create_missing_teacher_profiles(apps, schema_editor):
    User = apps.get_model('auth', 'User')
    Teacher = apps.get_model('main', 'Teacher')
    Student = apps.get_model('main', 'Student')
    
    created_count = 0
    for user in User.objects.all():
        # Skip if user already has a teacher profile
        if Teacher.objects.filter(user=user).exists():
            continue
        
        # Skip if user has a student profile
        if Student.objects.filter(user=user).exists():
            continue
        
        # Skip superusers (they get profiles on first login)
        if user.is_superuser:
            continue
        
        # Create teacher profile for this user
        Teacher.objects.create(
            user=user,
            department='General',
            active=True
        )
        created_count += 1
        print(f"[MIGRATION] Created teacher profile for user: {user.username}")
    
    print(f"[MIGRATION] Total teacher profiles created: {created_count}")

def reverse_migration(apps, schema_editor):
    pass

class Migration(migrations.Migration):

    dependencies = [
        ('main', '0013_activate_existing_teachers'),
    ]

    operations = [
        migrations.RunPython(create_missing_teacher_profiles, reverse_migration),
    ]
