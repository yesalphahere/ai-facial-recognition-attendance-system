from django.db import models
from django.contrib.auth.models import User

class Teacher(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name='teacher_profile')
    profile_pic = models.ImageField(upload_to='teacher_profiles/', null=True, blank=True)
    department = models.CharField(max_length=100)
    default_start_time = models.TimeField(null=True, blank=True, default="09:00:00")
    default_off_time = models.TimeField(null=True, blank=True, default="17:00:00")
    active = models.BooleanField(default=False)

    def __str__(self):
        return self.user.get_full_name() or self.user.username

class Student(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name='student_profile')
    student_id = models.CharField(max_length=20, unique=True)
    profile_pic = models.ImageField(upload_to='student_profiles/', null=True, blank=True)
    address = models.TextField(null=True, blank=True) # Encrypted at rest
    phone_number = models.TextField(null=True, blank=True) # Encrypted at rest
    created_by = models.ForeignKey(Teacher, on_delete=models.SET_NULL, null=True)
    
    # Biometric Face Data - Fixed 6 images
    img1 = models.ImageField(upload_to='face_data/', null=True, blank=True)
    img2 = models.ImageField(upload_to='face_data/', null=True, blank=True)
    img3 = models.ImageField(upload_to='face_data/', null=True, blank=True)
    img4 = models.ImageField(upload_to='face_data/', null=True, blank=True)
    img5 = models.ImageField(upload_to='face_data/', null=True, blank=True)
    img6 = models.ImageField(upload_to='face_data/', null=True, blank=True)
    img7 = models.ImageField(upload_to='face_data/', null=True, blank=True)
    img8 = models.ImageField(upload_to='face_data/', null=True, blank=True)
    img9 = models.ImageField(upload_to='face_data/', null=True, blank=True)
    img10 = models.ImageField(upload_to='face_data/', null=True, blank=True)
    is_active = models.BooleanField(default=True)
    face_encodings = models.BinaryField(null=True, blank=True, help_text="Pickled list of face encodings")

    class Meta:
        ordering = ['-id']

    def __str__(self):
        return f"{self.student_id} - {self.user.get_full_name()}"

    def save(self, *args, **kwargs):
        super().save(*args, **kwargs)



class AttendanceSession(models.Model):
    CAMERA_CHOICES = [
        ('Webcam', 'Webcam (Laptop/USB)'),
        ('IP_Camera', 'IP Camera (Custom Stream)'),
    ]
    teacher = models.ForeignKey(Teacher, on_delete=models.CASCADE)
    course_name = models.CharField(max_length=200)
    section_name = models.CharField(max_length=50, null=True, blank=True)
    camera_source = models.CharField(max_length=20, choices=CAMERA_CHOICES, default='Webcam')
    camera_url = models.CharField(max_length=500, null=True, blank=True, help_text="Camera stream URL")
    camera_port = models.IntegerField(null=True, blank=True, help_text="Camera stream port")
    start_time = models.TimeField()
    off_time = models.TimeField()
    date = models.DateField(auto_now_add=True)
    is_active = models.BooleanField(default=False)
    session_started = models.BooleanField(default=False, help_text="True when session is actually started by teacher")
    started_at = models.DateTimeField(null=True, blank=True, help_text="Timestamp when session was started")
    
    class Meta:
        ordering = ['-date', '-id']

    def __str__(self):
        return f"{self.course_name} ({self.date})"

class AttendanceRecord(models.Model):
    session = models.ForeignKey(AttendanceSession, on_delete=models.CASCADE, related_name='records')
    student = models.ForeignKey(Student, on_delete=models.CASCADE)
    check_in_time = models.TimeField(auto_now_add=True)
    status = models.CharField(max_length=10, choices=[('Present', 'Present'), ('Absent', 'Absent')], default='Present')
    is_late = models.BooleanField(default=False)
    confidence_score = models.FloatField(default=0.0, help_text="AI match confidence percentage")

    class Meta:
        unique_together = ('session', 'student')
        ordering = ['-id']
