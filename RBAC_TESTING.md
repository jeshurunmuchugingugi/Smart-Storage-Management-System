# 🧪 RBAC Testing Guide

## ✅ RBAC Implementation Complete

Role-Based Access Control is now fully implemented and ready to test.

---

## 🎯 Test Accounts Created

### 1. Admin Account
- **Username**: `admin`
- **Password**: `admin123`
- **Role**: `admin`
- **Permissions**: Full access (Create, Read, Update, Delete)

### 2. Manager Account
- **Username**: `manager`
- **Password**: `manager123`
- **Role**: `manager`
- **Permissions**: Create, Read, Update (Cannot Delete)

---

## 🧪 How to Test

### Test 1: Admin Can Delete Units
1. Go to http://localhost:3000/admin/login
2. Login with `admin` / `admin123`
3. Navigate to "Units / Storage" tab
4. ✅ You should see **Delete** buttons on all units
5. Click Delete on any unit → Should succeed

### Test 2: Manager Cannot Delete Units
1. Logout from admin account
2. Login with `manager` / `manager123`
3. Navigate to "Units / Storage" tab
4. ❌ **Delete** buttons should be **hidden**
5. Can still Edit units

### Test 3: API Level Protection
```bash
# Get admin token
curl -X POST http://localhost:5001/api/admin/login \
  -H "Content-Type: application/json" \
  -d '{"username":"admin","password":"admin123"}'

# Copy the access_token from response

# Try to delete unit as admin (should work)
curl -X DELETE http://localhost:5001/api/units/1 \
  -H "Authorization: Bearer YOUR_ADMIN_TOKEN"

# Get manager token
curl -X POST http://localhost:5001/api/admin/login \
  -H "Content-Type: application/json" \
  -d '{"username":"manager","password":"manager123"}'

# Try to delete unit as manager (should fail with 403)
curl -X DELETE http://localhost:5001/api/units/1 \
  -H "Authorization: Bearer YOUR_MANAGER_TOKEN"
```

Expected response for manager:
```json
{
  "error": "Access denied. Insufficient permissions."
}
```

---

## 📋 What Was Implemented

### Backend Changes
1. ✅ Added `role` field to User model
2. ✅ Created `@role_required()` decorator
3. ✅ Protected DELETE endpoint (admin only)
4. ✅ Protected POST/PUT endpoints (admin + manager)
5. ✅ JWT tokens include role in claims
6. ✅ Database migration completed

### Frontend Changes
1. ✅ Role stored in AuthContext
2. ✅ Conditional rendering of Delete buttons
3. ✅ Only admins see Delete buttons

---

## 🔒 Protected Endpoints

| Endpoint | Method | Admin | Manager | User |
|----------|--------|-------|---------|------|
| `/api/units` | POST | ✅ | ✅ | ❌ |
| `/api/units/:id` | PUT | ✅ | ✅ | ❌ |
| `/api/units/:id` | DELETE | ✅ | ❌ | ❌ |
| `/api/bookings` | GET | ✅ | ✅ | ✅ |
| `/api/bookings` | POST | ✅ | ✅ | ✅ |

---

## ✅ Verification Checklist

- [x] Admin can login
- [x] Manager can login
- [x] Admin sees delete buttons
- [x] Manager doesn't see delete buttons
- [x] Admin can delete units via API
- [x] Manager gets 403 when trying to delete via API
- [x] Both can create/edit units
- [x] JWT tokens include role

---

## 🚀 Start Testing

1. **Start Backend**:
   ```bash
   cd server
   python3 app.py
   ```

2. **Start Frontend**:
   ```bash
   cd client
   npm start
   ```

3. **Test Both Accounts**:
   - Login as admin → Full access
   - Login as manager → Limited access

---

**Status**: ✅ RBAC Fully Implemented & Ready to Test
**Requirement**: ✅ RBAC (Role-Based Access Control) - COMPLETE
