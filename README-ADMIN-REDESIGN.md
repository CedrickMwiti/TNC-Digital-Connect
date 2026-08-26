# Tharaka-Nithi Digital Connect — Admin Portal Redesign

This version keeps the public Digital Connect app and adds three separate administrative workspaces:

- `admin-login.html` — portal selector
- `county-admin.html` — County Administration
- `hospital-admin.html` — Hospital Administration
- `security-admin.html` — Security & Emergency Administration

## Design principle

The public platform is shared, but administrative responsibilities are separated. Approved public information can flow from the relevant admin portal to the public app without exposing internal data.

### County Admin
County announcements, services, opportunities, departments, agriculture, transport, users and roles.

### Hospital Admin
Hospital queues, appointments, patients, staff, capacity, services and approved public updates. Patient/clinical information is marked restricted.

### Security & Emergency Admin
Incidents, emergency alerts, response teams, incident map, restricted reports and audit trail. Sensitive incident details stay inside the restricted workspace; only approved alerts reach the public app.

## Important
This is still a frontend-only. Admin changes are stored locally in the browser. Production requires a secure backend, server-side authorization, MFA, audit logging, encryption, database separation/row-level permissions, secure session management, backups and verified institutional data.
