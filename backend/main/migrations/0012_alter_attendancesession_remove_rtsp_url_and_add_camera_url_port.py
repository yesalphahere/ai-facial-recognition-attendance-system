# Generated migration for removing rtsp_url and adding camera_url and camera_port

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('main', '0011_attendancesession_session_started'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='attendancesession',
            name='rtsp_url',
        ),
        migrations.AddField(
            model_name='attendancesession',
            name='camera_url',
            field=models.CharField(blank=True, help_text='Camera stream URL', max_length=500, null=True),
        ),
        migrations.AddField(
            model_name='attendancesession',
            name='camera_port',
            field=models.IntegerField(blank=True, help_text='Camera stream port', null=True),
        ),
        migrations.AlterField(
            model_name='attendancesession',
            name='camera_source',
            field=models.CharField(choices=[('Webcam', 'Webcam (Laptop/USB)'), ('IP_Camera', 'IP Camera (Custom Stream)')], default='Webcam', max_length=20),
        ),
    ]
