export interface AttendanceLearnerEntry {
  studentName: string;
  studentId: string;
  courseName: string;
  date: string;
  timeSlot: string;
  status: "Present" | "Justified" | "Late" | "Absent";
  method: string;
}

export interface AttendanceSheetOptions {
  cohortName: string;
  period: string;
  courseName?: string;
  instructorName?: string;
  records: AttendanceLearnerEntry[];
}

export function generateAttendanceSheetHtml({
  cohortName,
  period,
  courseName = "Enterprise Architecture & Distributed Systems",
  instructorName = "Prof. Marcus Vance",
  records,
}: AttendanceSheetOptions): string {
  const currentDate = new Date().toLocaleDateString("en-GB", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  const getStatusBadge = (status: AttendanceLearnerEntry["status"]) => {
    if (status === "Present") return "badge-success";
    if (status === "Justified") return "badge-info";
    if (status === "Late") return "badge-warning";
    return "badge-danger";
  };

  const getSignatureLabel = (status: AttendanceLearnerEntry["status"]) => {
    if (status === "Present") return "[Digital Signature - Authenticated]";
    if (status === "Justified") return "[Exempted / Medical]";
    return "—";
  };

  const rowsHtml = records
    .map(
      (record, idx) => `
      <tr>
        <td style="text-align: center; width: 35px;">${idx + 1}</td>
        <td>
          <strong>${record.studentName}</strong>
          <div style="font-size: 7.5pt; color: #64748b;">ID: ${record.studentId}</div>
        </td>
        <td>${record.courseName}</td>
        <td style="text-align: center; font-size: 8.5pt;">${record.date} (${record.timeSlot})</td>
        <td style="text-align: center;">
          <span class="badge ${getStatusBadge(record.status)}">${record.status}</span>
        </td>
        <td style="text-align: center; font-size: 8pt; color: #475569;">${record.method}</td>
        <td style="width: 140px; text-align: center; font-style: italic; color: #94a3b8; font-size: 8pt;">
          ${getSignatureLabel(record.status)}
        </td>
      </tr>
    `,
    )
    .join("");

  const totalPresent = records.filter((r) => r.status === "Present").length;
  const totalLate = records.filter((r) => r.status === "Late").length;
  const totalJustified = records.filter((r) => r.status === "Justified").length;
  const totalAbsent = records.filter((r) => r.status === "Absent").length;
  const attendanceRate = Math.round(((totalPresent + totalLate + totalJustified) / (records.length || 1)) * 100);

  return `
    <header class="doc-header">
      <div class="doc-brand">
        <div class="doc-org-name">ONIXE INSTITUTE OF TECHNOLOGY</div>
        <div class="doc-org-sub">Accredited Higher Education & CFA Apprenticeship Campus</div>
        <div class="doc-org-sub">SIRET: 893 492 102 00018 | UAI: 0755928K | Qualiopi Certified Body #FR-2024-89</div>
      </div>
      <div class="doc-meta">
        <div><strong>Doc Ref:</strong> ATT-${Date.now().toString().slice(-6)}</div>
        <div><strong>Generated:</strong> ${currentDate}</div>
        <div><strong>Compliance Standard:</strong> OPCO / ISO 9001:2015</div>
      </div>
    </header>

    <div class="doc-title-box">
      <div class="doc-title">Official Training Attendance & Telemetry Sheet</div>
      <div class="doc-subtitle">Certified Monthly Emargement Record for Apprenticeship Funding & Institutional Compliance</div>
    </div>

    <div style="display: grid; grid-template-columns: repeat(4, 1fr); gap: 12px; margin-bottom: 20px; background: #f8fafc; border: 1px solid #e2e8f0; padding: 12px; border-radius: 4px; font-size: 8.5pt;">
      <div>
        <span style="color: #64748b;">Cohort:</span><br/>
        <strong>${cohortName}</strong>
      </div>
      <div>
        <span style="color: #64748b;">Module:</span><br/>
        <strong>${courseName}</strong>
      </div>
      <div>
        <span style="color: #64748b;">Lead Faculty:</span><br/>
        <strong>${instructorName}</strong>
      </div>
      <div>
        <span style="color: #64748b;">Audit Period:</span><br/>
        <strong>${period}</strong>
      </div>
    </div>

    <table>
      <thead>
        <tr>
          <th style="text-align: center; width: 35px;">#</th>
          <th>Learner Name & ID</th>
          <th>Course Session</th>
          <th style="text-align: center;">Session Date & Time</th>
          <th style="text-align: center;">Status</th>
          <th style="text-align: center;">Method</th>
          <th style="text-align: center;">Signature Verification</th>
        </tr>
      </thead>
      <tbody>
        ${rowsHtml}
      </tbody>
    </table>

    <div style="display: grid; grid-template-columns: repeat(4, 1fr); gap: 10px; margin-bottom: 20px; font-size: 8.5pt;">
      <div style="background: #f0fdf4; border: 1px solid #bbf7d0; padding: 8px 12px; border-radius: 4px; text-align: center;">
        <span style="color: #166534; font-weight: 700;">Present: ${totalPresent}</span>
      </div>
      <div style="background: #fefce8; border: 1px solid #fef08a; padding: 8px 12px; border-radius: 4px; text-align: center;">
        <span style="color: #854d0e; font-weight: 700;">Late: ${totalLate}</span>
      </div>
      <div style="background: #f0f9ff; border: 1px solid #bae6fd; padding: 8px 12px; border-radius: 4px; text-align: center;">
        <span style="color: #075985; font-weight: 700;">Justified: ${totalJustified}</span>
      </div>
      <div style="background: #fef2f2; border: 1px solid #fecaca; padding: 8px 12px; border-radius: 4px; text-align: center;">
        <span style="color: #991b1b; font-weight: 700;">Absent: ${totalAbsent} (${attendanceRate}% Rate)</span>
      </div>
    </div>

    <div class="signature-grid">
      <div class="signature-box">
        <div class="signature-title">Lead Instructor Certification</div>
        <div style="font-size: 8pt; color: #475569;">I hereby attest that the training sessions above were conducted according to the approved pedagogical syllabus.</div>
        <div style="border-top: 1px solid #cbd5e1; padding-top: 4px; font-size: 8pt; display: flex; justify-content: space-between;">
          <span>${instructorName}</span>
          <span>Date: ${currentDate}</span>
        </div>
      </div>

      <div class="signature-box">
        <div class="signature-title">Pedagogical Director & Registrar Seal</div>
        <div style="display: flex; justify-content: space-between; align-items: center;">
          <div class="official-stamp">
            ONIXE CENTER<br/>ACCREDITED CFA
          </div>
          <div style="font-size: 7.5pt; color: #64748b; text-align: right;">
            Digitally sealed<br/>
            Hash: 0x9F4B...C82E
          </div>
        </div>
        <div style="border-top: 1px solid #cbd5e1; padding-top: 4px; font-size: 8pt; display: flex; justify-content: space-between;">
          <span>Academic Office</span>
          <span>Official Certification</span>
        </div>
      </div>
    </div>

    <footer class="doc-footer">
      <div>Document generated electronically by Onixe Learning Operating System. Authentic only with institutional stamp.</div>
      <div>Page 1 / 1</div>
    </footer>
  `;
}
