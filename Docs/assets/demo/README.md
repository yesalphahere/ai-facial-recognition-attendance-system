# 🎬 Live Demonstration Materials & Presentation Runbooks

## AI-Powered Smart Attendance Management System

> **Directory:** `assets/demo/`  
> **Target Audience:** Presenters, Viva Defense Committee, Evaluators, Recruiters  

---

## 📑 Included Materials

| File | Type | Description |
| :--- | :---: | :--- |
| [`demo_walkthrough_guide.md`](demo_walkthrough_guide.md) | **Markdown Guide** | Detailed 10-minute live demonstration script covering all six phases: Authentication, 10-Shot Enrollment, Real-Time HUD, Anti-Spoofing, Student Portal, and Session Reconciliation. |
| [`sample_payloads.json`](sample_payloads.json) | **JSON Reference** | Complete request and response payloads for automated Postman testing or offline endpoint verification without live camera hardware. |

---

## 🎯 Quick Presentation Summary

When presenting this project to an evaluator or hiring manager, focus on these three core achievements:

1. **Sub-40ms Inference on CPU:**
   - How OpenCV's ONNX runtime (YuNet + SFace) and **vectorized matrix dot products** enable real-time tracking without needing a dedicated GPU.
2. **Passive EMPR Anti-Spoofing:**
   - How Eye-Mouth Position Ratio temporal variance rejects static printed photos and phone screen presentations without annoying active user prompts.
3. **Zero-Plaintext Biometric Vault:**
   - How Fernet AES-128 encryption protects biometric photos on disk, and how in-memory RAM streaming decryption prevents decrypted images from ever touching physical storage.

---

<div align="center">
  <b>AI-Powered Smart Attendance Management System</b><br/>
  <i>Live Demonstration Materials & Presentation Runbooks.</i>
</div>
