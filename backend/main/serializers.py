from rest_framework import serializers
from django.contrib.auth.models import User
from .models import Teacher, Student, AttendanceSession, AttendanceRecord

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['id', 'username', 'email', 'first_name', 'last_name']

class TeacherSerializer(serializers.ModelSerializer):
    user = UserSerializer(read_only=True)
    class Meta:
        model = Teacher
        fields = '__all__'

class StudentSerializer(serializers.ModelSerializer):
    user = UserSerializer(read_only=True)
    
    class Meta:
        model = Student
        fields = ['id', 'user', 'student_id', 'profile_pic', 'address', 'phone_number', 'img1', 'img2', 'img3', 'img4', 'img5', 'img6', 'is_active']

class SimpleSessionSerializer(serializers.ModelSerializer):
    class Meta:
        model = AttendanceSession
        fields = ['id', 'course_name', 'date']

class AttendanceRecordSerializer(serializers.ModelSerializer):
    student_name = serializers.CharField(source='student.user.get_full_name', read_only=True)
    student_id = serializers.CharField(source='student.student_id', read_only=True)
    session_detail = SimpleSessionSerializer(source='session', read_only=True)
    check_in_time = serializers.SerializerMethodField()
    
    class Meta:
        model = AttendanceRecord
        fields = ['id', 'session', 'session_detail', 'student', 'student_name', 'student_id', 'check_in_time', 'status', 'is_late', 'confidence_score']

    def get_check_in_time(self, obj):
        if obj.check_in_time:
            return obj.check_in_time.strftime('%I:%M:%S %p')
        return None

class AttendanceSessionSerializer(serializers.ModelSerializer):
    records = AttendanceRecordSerializer(many=True, read_only=True)
    
    class Meta:
        model = AttendanceSession
        fields = '__all__'

    def validate_camera_port(self, value):
        if value == "" or value is None:
            return None
        return value
