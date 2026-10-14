import os
from cryptography.fernet import Fernet
from django.conf import settings

class SecurityUtils:
    _fernet = None

    @classmethod
    def get_fernet(cls):
        if cls._fernet is None:
            key = os.getenv('ENCRYPTION_KEY')
            if not key:
                # Fallback if not set (though it should be in .env)
                key = Fernet.generate_key()
            cls._fernet = Fernet(key)
        return cls._fernet

    @classmethod
    def encrypt_data(cls, data) -> bytes:
        if not data: return data
        f = cls.get_fernet()
        if isinstance(data, str):
            data = data.encode()
        return f.encrypt(data)

    @classmethod
    def decrypt_data(cls, encrypted_data) -> bytes:
        if not encrypted_data: return encrypted_data
        f = cls.get_fernet()
        try:
            if isinstance(encrypted_data, str):
                encrypted_data = encrypted_data.encode()
            return f.decrypt(encrypted_data)
        except:
            return None # Return None on failure instead of a string
