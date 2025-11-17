# Imports Module Documentation

## Overview

The Imports module allows bulk importing of Students, Teachers, Schools, and Coordinators from CSV or Excel files using streaming processing.

## Features

- ✅ **File Format Support**: CSV (.csv), Excel (.xlsx, .xls)
- ✅ **Maximum File Size**: 100MB
- ✅ **Stream Processing**: Reads files row by row using async streams (efficient memory usage)
- ✅ **Validation**: Each row is validated using DTOs before insertion
- ✅ **Error Reporting**: Detailed error reporting per row
- ✅ **Progress Logging**: Logs progress every 100 rows
- ✅ **Automatic Cleanup**: Temporary files are automatically deleted
- ✅ **Role-Based Access**: Admin and Coordinator roles

## Endpoints

### 1. Import Students
**POST** `/api/imports/students`

**Roles**: `admin`, `coordinator`

**Required Columns**:
- `firstName` - Student first name (2-100 characters)
- `lastName` - Student last name (2-100 characters)
- `email` - Student email (unique, valid email format)
- `schoolId` - UUID of the school

**Optional Columns**:
- `username` - Login username (3-50 characters)
- `password` - Login password (minimum 6 characters)
- `phone` - Phone number (max 20 characters)
- `avatar` - Avatar URL (valid URL)
- `bio` - Biography (max 1000 characters)
- `isActive` - Active status (true/false, default: true)

### 2. Import Teachers
**POST** `/api/imports/teachers`

**Roles**: `admin`, `coordinator`

**Required Columns**:
- `firstName` - Teacher first name (2-100 characters)
- `lastName` - Teacher last name (2-100 characters)
- `email` - Teacher email (unique, valid email format)
- `schoolId` - UUID of the school

**Optional Columns**:
- `username` - Login username (3-50 characters)
- `password` - Login password (minimum 6 characters)
- `phone` - Phone number (max 20 characters)
- `avatar` - Avatar URL (valid URL)
- `bio` - Biography (max 1000 characters)
- `isActive` - Active status (true/false, default: true)

### 3. Import Schools
**POST** `/api/imports/schools`

**Roles**: `admin`

**Required Columns**:
- `name` - School name (3-200 characters)
- `email` - School email (unique, valid email format)
- `phone` - Phone number (max 20 characters)
- `city` - City (max 100 characters)
- `state` - State/Province (max 100 characters)
- `type` - School type (max 50 characters, e.g., "public", "private")

**Optional Columns**:
- `website` - Website URL (valid URL)
- `address` - Street address (max 255 characters)
- `postalCode` - Postal code (max 20 characters)
- `description` - School description (max 1000 characters)
- `isActive` - Active status (true/false, default: true)

### 4. Import Coordinators
**POST** `/api/imports/coordinators`

**Roles**: `admin`

**Required Columns**:
- `firstName` - Coordinator first name (2-100 characters)
- `lastName` - Coordinator last name (2-100 characters)
- `email` - Coordinator email (unique, valid email format)
- `schoolId` - UUID of the school

**Optional Columns**:
- `username` - Login username (3-50 characters)
- `password` - Login password (minimum 6 characters)
- `phone` - Phone number (max 20 characters)
- `avatar` - Avatar URL (valid URL)
- `bio` - Biography (max 1000 characters)
- `isActive` - Active status (true/false, default: true)

## CSV/Excel File Structure Examples

### Students Example (CSV)
```csv
firstName,lastName,email,username,password,phone,schoolId,isActive
John,Doe,john.doe@example.com,johndoe,SecurePass123,+1234567890,550e8400-e29b-41d4-a716-446655440000,true
Jane,Smith,jane.smith@example.com,janesmith,SecurePass456,+1234567891,550e8400-e29b-41d4-a716-446655440000,true
```

### Teachers Example (CSV)
```csv
firstName,lastName,email,username,password,phone,schoolId,bio,isActive
Maria,Garcia,maria.garcia@example.com,mariagarcia,TeacherPass123,+1234567892,550e8400-e29b-41d4-a716-446655440000,"Experienced English teacher",true
Carlos,Rodriguez,carlos.rodriguez@example.com,carlosrodriguez,TeacherPass456,+1234567893,550e8400-e29b-41d4-a716-446655440000,"10 years of teaching experience",true
```

### Schools Example (CSV)
```csv
name,email,phone,city,state,type,website,address,description,isActive
U.E. Colegio Los Arcos,contacto@losarcos.edu.ve,+58424-1234567,Caracas,Distrito Capital,public,https://losarcos.edu.ve,"Av. Principal Los Ruices","Institución de excelencia",true
Colegio San Agustín,info@sanagustin.edu.ve,+58424-7654321,Valencia,Carabobo,private,https://sanagustin.edu.ve,"Calle 100 Centro","Educación integral",true
```

### Coordinators Example (CSV)
```csv
firstName,lastName,email,username,password,phone,schoolId,bio,isActive
Pedro,Martinez,pedro.martinez@example.com,pedromartinez,CoordPass123,+1234567894,550e8400-e29b-41d4-a716-446655440000,"Academic coordinator",true
Ana,Lopez,ana.lopez@example.com,analopez,CoordPass456,+1234567895,550e8400-e29b-41d4-a716-446655440000,"15 years experience",true
```

## Response Format

```typescript
{
  "success": true,
  "totalRows": 100,
  "successCount": 95,
  "errorCount": 5,
  "errors": [
    {
      "row": 10,
      "error": "Invalid email format",
      "data": { "firstName": "John", "email": "invalid-email" }
    }
  ],
  "message": "Import completed with 5 errors out of 100 rows",
  "processingTime": 1234
}
```

## Usage with cURL

### Import Students
```bash
curl -X POST http://localhost:3000/api/imports/students \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -F "file=@students.csv"
```

### Import Teachers
```bash
curl -X POST http://localhost:3000/api/imports/teachers \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -F "file=@teachers.xlsx"
```

### Import Schools
```bash
curl -X POST http://localhost:3000/api/imports/schools \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -F "file=@schools.csv"
```

### Import Coordinators
```bash
curl -X POST http://localhost:3000/api/imports/coordinators \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -F "file=@coordinators.xlsx"
```

## Usage with Postman

1. Select **POST** method
2. Enter URL: `http://localhost:3000/api/imports/students` (or teachers, schools, coordinators)
3. Go to **Authorization** tab:
   - Type: `Bearer Token`
   - Token: Your JWT token
4. Go to **Body** tab:
   - Select `form-data`
   - Add key: `file` (change type to `File`)
   - Select your CSV or Excel file
5. Click **Send**

## Error Handling

### Common Errors

1. **File too large**: Maximum 100MB
   ```json
   {
     "statusCode": 400,
     "message": "File size exceeds maximum limit of 100MB"
   }
   ```

2. **Invalid file type**: Only CSV and Excel allowed
   ```json
   {
     "statusCode": 400,
     "message": "Invalid file type. Only CSV and Excel files are supported."
   }
   ```

3. **Missing required columns**: Headers not found
   ```json
   {
     "success": false,
     "totalRows": 0,
     "errors": [
       {
         "row": 2,
         "error": "firstName must be longer than or equal to 2 characters",
         "data": { ... }
       }
     ]
   }
   ```

4. **Validation errors**: Invalid data in specific rows
   - Errors are collected per row
   - Maximum 1000 errors collected
   - First 100 errors returned in response

## Best Practices

### 1. File Preparation
- ✅ Use UTF-8 encoding for CSV files
- ✅ Include header row with exact column names
- ✅ Use consistent date formats
- ✅ Validate UUIDs before upload (schoolId)
- ✅ Keep file size under 100MB

### 2. Data Validation
- ✅ Validate emails before upload
- ✅ Ensure unique emails across system
- ✅ Use strong passwords (minimum 6 characters)
- ✅ Verify schoolId exists in database

### 3. Performance
- ✅ Files are processed with streaming (memory efficient)
- ✅ Progress logged every 100 rows
- ✅ Consider splitting very large files (>50,000 rows)

### 4. Error Recovery
- ✅ Review error report
- ✅ Fix problematic rows
- ✅ Re-upload only failed rows
- ✅ Check database for partial imports

## Technical Details

### Stream Processing
The service uses `exceljs` with Node.js streams to read files row by row:
- Memory efficient for large files
- Async iteration with `for await`
- Processes one row at a time
- Validates each row individually

### File Storage
- Uses `FileSystemStoredFile` from `nestjs-form-data`
- Files stored in `/tmp/nestjs-form-data`
- Automatic cleanup after processing
- Cleanup on both success and failure

### Validation
- Uses `class-validator` with DTOs
- Validates each row before insertion
- Collects all errors (up to 1000)
- Returns first 100 errors in response

## Troubleshooting

### Issue: "File not found" error
**Solution**: Ensure multipart/form-data is properly configured

### Issue: Import is slow
**Solution**: 
- Check file size
- Review server resources
- Consider splitting file

### Issue: Many validation errors
**Solution**:
- Review CSV structure
- Validate data before upload
- Check required vs optional fields

### Issue: Memory issues with large files
**Solution**:
- Stream processing should handle large files
- If issues persist, split file into smaller chunks
- Monitor server memory usage

## Security Considerations

1. **Authentication**: All endpoints require JWT authentication
2. **Authorization**: Role-based access control (admin, coordinator)
3. **File Validation**: MIME type and size validation
4. **Temporary Storage**: Files automatically deleted after processing
5. **Input Validation**: All data validated before database insertion

## Future Enhancements

- [ ] Async job processing with job queue
- [ ] Real-time progress updates via WebSocket
- [ ] Template download for each entity type
- [ ] Bulk update support (not just insert)
- [ ] Duplicate detection and handling
- [ ] Data transformation rules
- [ ] Import history and audit log

