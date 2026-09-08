export interface SchoolCertificateOptions {
  studentName: string;
  studentId: string;
  birthDate: string;
  birthPlace: string;
  academicYear: string;
  programTitle: string;
  departmentName: string;
  degreeLevel: string; // e.g. "Master Level 7 (Bac+5)"
  campusName: string;
  enrollmentStatus: "Active Regular" | "Apprenticeship CFA" | "Continuing Education";
}

export function generateSchoolCertificateHtml({
  studentName,
  studentId,
  birthDate,
  birthPlace,
  academicYear,
  programTitle,
  departmentName,
  degreeLevel,
  campusName,
  enrollmentStatus,
}: SchoolCertificateOptions): string {
  const currentDate = new Date().toLocaleDateString("en-GB", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  return `
    <header class="doc-header">
      <div class="doc-brand">
        <div class="doc-org-name">ONIXE INSTITUTE OF TECHNOLOGY</div>
        <div class="doc-org-sub">Higher Institute of Computer Science, Engineering & Apprenticeship Center</div>
        <div class="doc-org-sub">Registered under Code UAI 0755928K | Academic District of Paris / Île-de-France</div>
      </div>
      <div class="doc-meta">
        <div><strong>Certificate ID:</strong> CRT-${Date.now().toString().slice(-8)}</div>
        <div><strong>Issued On:</strong> ${currentDate}</div>
        <div><strong>Valid For:</strong> ${academicYear}</div>
      </div>
    </header>

    <div class="doc-title-box" style="text-align: center; border-left: none; border: 2px solid #0f172a; padding: 18px;">
      <div class="doc-title" style="font-size: 16pt;">OFFICIAL CERTIFICATE OF ENROLLMENT</div>
      <div class="doc-subtitle" style="font-size: 10pt; font-weight: 600; color: #334155; margin-top: 4px;">CERTIFICAT DE SCOLARITÉ & D'INSCRIPTION ADMINISTRATIVE</div>
    </div>

    <div style="font-size: 11pt; line-height: 1.8; margin: 30px 0; color: #1e293b;">
      <p style="margin-bottom: 16px;">
        The Registrar of the <strong>Onixe Institute of Technology</strong> hereby certifies that:
      </p>

      <div style="background: #f8fafc; border: 1px solid #cbd5e1; border-radius: 6px; padding: 18px; margin-bottom: 20px; font-size: 10.5pt;">
        <table style="margin-bottom: 0; border: none;">
          <tr style="background: transparent;"><td style="border: none; width: 220px; color: #64748b; font-weight: 600;">Student Name:</td><td style="border: none; font-size: 12pt; font-weight: 800;">${studentName}</td></tr>
          <tr style="background: transparent;"><td style="border: none; color: #64748b; font-weight: 600;">Student ID (INE / Matricule):</td><td style="border: none; font-weight: 700;">${studentId}</td></tr>
          <tr style="background: transparent;"><td style="border: none; color: #64748b; font-weight: 600;">Date & Place of Birth:</td><td style="border: none;">${birthDate} in ${birthPlace}</td></tr>
          <tr style="background: transparent;"><td style="border: none; color: #64748b; font-weight: 600;">Academic Department:</td><td style="border: none;">${departmentName}</td></tr>
          <tr style="background: transparent;"><td style="border: none; color: #64748b; font-weight: 600;">Program / Degree Track:</td><td style="border: none; font-weight: 700; color: #0f172a;">${programTitle}</td></tr>
          <tr style="background: transparent;"><td style="border: none; color: #64748b; font-weight: 600;">Academic Degree Level:</td><td style="border: none;">${degreeLevel}</td></tr>
          <tr style="background: transparent;"><td style="border: none; color: #64748b; font-weight: 600;">Enrolled Campus:</td><td style="border: none;">${campusName}</td></tr>
          <tr style="background: transparent;"><td style="border: none; color: #64748b; font-weight: 600;">Enrollment Regime:</td><td style="border: none;"><span class="badge badge-success">${enrollmentStatus}</span></td></tr>
        </table>
      </div>

      <p style="margin-bottom: 14px;">
        Is officially enrolled as a regular full-time student for the <strong>${academicYear}</strong> academic year.
      </p>

      <p style="font-size: 9.5pt; color: #475569;">
        This certificate is delivered to the student to serve and prove administrative rights for student welfare organizations, social security, transport authorities, internship agreements, and student visa renewals.
      </p>
    </div>

    <div class="signature-grid" style="margin-top: 40px;">
      <div class="signature-box" style="height: 130px;">
        <div class="signature-title">Student Signature</div>
        <div style="font-size: 8pt; color: #64748b;">I acknowledge the terms of enrollment and internal academy charter.</div>
        <div style="border-top: 1px solid #cbd5e1; padding-top: 4px; font-size: 8pt;">
          ${studentName}
        </div>
      </div>

      <div class="signature-box" style="height: 130px;">
        <div class="signature-title">Registrar & Official Center Seal</div>
        <div style="display: flex; justify-content: space-between; align-items: center;">
          <div class="official-stamp" style="padding: 10px 14px; font-size: 8.5pt;">
            ONIXE TECH<br/>REGISTRAR OFFICE
          </div>
          <div style="font-size: 7.5pt; color: #64748b; text-align: right;">
            Verification Code:<br/>
            <strong>CRT-SEC-${Date.now().toString().slice(-6)}</strong>
          </div>
        </div>
        <div style="border-top: 1px solid #cbd5e1; padding-top: 4px; font-size: 8pt; display: flex; justify-content: space-between;">
          <span>Academic Registrar</span>
          <span>Date: ${currentDate}</span>
        </div>
      </div>
    </div>

    <footer class="doc-footer" style="margin-top: 45px;">
      <div>Onixe Learning Operating System | Certified Higher Education Provider | Verify at onixe.edu/credentials</div>
      <div>Page 1 / 1</div>
    </footer>
  `;
}
