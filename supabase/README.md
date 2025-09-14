# Student Tracker Backend

This is the Supabase backend for the Student Tracker application.

## Project Structure

```
supabase/
├── config.toml          # Supabase configuration
├── seed.sql            # Database schema and initial data
├── functions/          # Edge functions
│   └── _shared/       # Shared utilities
│       └── cors.ts    # CORS headers
└── .gitignore         # Supabase gitignore
```

## Database Schema

The application uses the following tables:

### app_users
- User management (students, teachers, admins)
- Fields: id, email, name, password_hash, role, cgpa, timestamps

### subjects
- Course/subject management
- Fields: id, name, teacher, credits, timestamps

### grades
- Student grade tracking
- Fields: id, student_id, subject_id, grade, obtained_marks, max_marks, timestamps

### attendance
- Daily attendance tracking
- Fields: id, student_id, subject, date, status, timestamps

### assignments
- Assignment management
- Fields: id, title, subject, due_date, status, timestamps

## Features

- **Authentication**: Custom login system using app_users table
- **Role-based Access**: Admin, Teacher, Student roles
- **Grade Management**: Track student grades with CGPA calculation
- **Attendance Tracking**: Daily attendance with status (present/absent/late)
- **Subject Management**: Course management with teacher assignments
- **Assignment Tracking**: Homework and project management
- **Row Level Security (RLS)**: Secure data access policies

## Setup Instructions

1. Create a new Supabase project
2. Run the `seed.sql` file to create tables and insert sample data
3. Configure your environment variables:
   ```
   SUPABASE_URL=your_project_url
   SUPABASE_ANON_KEY=your_anon_key
   ```

## Sample Login Credentials

### Admin
- Email: admin@school.edu
- Password: admin123

### Teachers
- Email: john.doe@school.edu / jane.smith@school.edu
- Password: password123

### Students
- Email: alice.johnson@student.edu / bob.wilson@student.edu / charlie.brown@student.edu
- Password: password123

## RLS Policies

All tables have Row Level Security enabled with appropriate policies for different user roles:

- **Public Read**: Most data is readable by all authenticated users
- **Admin Control**: Admins can perform all operations
- **Teacher Permissions**: Teachers can manage grades, attendance, and assignments
- **Student Access**: Students can view their own data

## Development

To extend this backend:

1. Add new tables in `seed.sql`
2. Create appropriate RLS policies
3. Add edge functions in `supabase/functions/` for custom logic
4. Update the frontend TypeScript types accordingly

## Security

- All tables use Row Level Security (RLS)
- Passwords are stored as hashes (implement proper hashing in production)
- API access is controlled through Supabase's built-in authentication
- CORS is configured for web application access