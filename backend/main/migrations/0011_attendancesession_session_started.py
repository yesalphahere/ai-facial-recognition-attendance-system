# Generated migration for session_started and started_at fields

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('main', '0010_student_img10_student_img7_student_img8_student_img9'),
    ]

    operations = [
        migrations.AddField(
            model_name='attendancesession',
            name='session_started',
            field=models.BooleanField(default=False, help_text='True when session is actually started by teacher'),
        ),
        migrations.AddField(
            model_name='attendancesession',
            name='started_at',
            field=models.DateTimeField(blank=True, null=True, help_text='Timestamp when session was started'),
        ),
    ]
