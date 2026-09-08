export interface TranscriptCourseItem {
  courseCode: string;
  courseTitle: string;
  ectsCredits: number;
  coefficient: number;
  grade: number; // out of 20
  status: "Validated" | "Remediation" | "Pending";
  evaluator: string;
}

export interface TranscriptOptions {
  studentName: string;
  studentId: string;
  birthDate?: string;
  cohortName: string;
  academicYear: string;
  programTitle: string;
  departmentName: string;
  courses: TranscriptCourseItem[];
  juryVerdict?: string;
  deliberationDate?: string;
}

export function generateTranscriptHtml({
  studentName,
  studentId,
  birthDate = "15/04/2001",
  cohortName,
  academicYear,
  programTitle,
  departmentName,
  courses,
  juryVerdict = "ADMITTED - HONORS (Mention Bien)",
  deliberationDate = new Date().toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" }),
}: TranscriptOptions): string {
  let totalWeighted = 0;
  let totalCoeff = 0;
  let totalEcts = 0;
  let validatedEcts = 0;

  for (const c of courses) {
    totalWeighted += c.grade * c.coefficient;
    totalCoeff += c.coefficient;
    totalEcts += c.ectsCredits;
    if (c.grade >= 10) {
      validatedEcts += c.ectsCredits;
    }
  }

  const overallAverage = totalCoeff > 0 ? (totalWeighted / totalCoeff).toFixed(2) : "0.00";

  const rowsHtml = courses
    .map(
      (c) => `
      <tr>
        <td><strong>${c.courseCode}</strong></td>
        <td>${c.courseTitle}</td>
        <td style="text-align: center;">${c.ectsCredits}</td>
        <td style="text-align: center;">${c.coefficient}</td>
        <td style="text-align: center; font-weight: 700; ${c.grade < 10 ? "color: #b91c1c;" : "color: #0f172a;"}">${c.grade.toFixed(2)} / 20</td>
        <td style="text-align: center;">
          <span class="badge ${c.grade >= 10 ? "badge-success" : "badge-danger"}">
            ${c.grade >= 10 ? "VALIDATED" : "REMEDIATION"}
          </span>
        </td>
        <td style="font-size: 8pt; color: #64748b;">${c.evaluator}</td>
      </tr>
    `,
    )
    .join("");

  return `
    <header class="doc-header">
      <div class="doc-brand">
        <div class="doc-org-name">ONIXE INSTITUTE OF TECHNOLOGY</div>
        <div class="doc-org-sub">Center of Higher Learning, Engineering & Applied Artificial Intelligence</div>
        <div class="doc-org-sub">Accreditation RNCP / France Compétences | European ECTS Framework</div>
      </div>
      <div class="doc-meta">
        <div><strong>Transcript ID:</strong> TR-${Date.now().toString().slice(-8)}</div>
        <div><strong>Academic Session:</strong> ${academicYear}</div>
        <div><strong>Deliberation Date:</strong> ${deliberationDate}</div>
      </div>
    </header>

    <div class="doc-title-box">
      <div class="doc-title">Official Academic Transcript & ECTS Deliberation</div>
      <div class="doc-subtitle">Certified Grade Report and Academic Performance Record</div>
    </div>

    <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 16px; margin-bottom: 20px; background: #f8fafc; border: 1px solid #e2e8f0; padding: 14px; border-radius: 4px; font-size: 9pt;">
      <div>
        <p style="margin-bottom: 4px;"><span style="color: #64748b;">Student Full Name:</span> <strong>${studentName}</strong></p>
        <p style="margin-bottom: 4px;"><span style="color: #64748b;">Student ID (INE/Matricule):</span> <strong>${studentId}</strong></p>
        <p><span style="color: #64748b;">Date of Birth:</span> ${birthDate}</p>
      </div>
      <div>
        <p style="margin-bottom: 4px;"><span style="color: #64748b;">Department:</span> <strong>${departmentName}</strong></p>
        <p style="margin-bottom: 4px;"><span style="color: #64748b;">Degree Track:</span> <strong>${programTitle}</strong></p>
        <p><span style="color: #64748b;">Cohort:</span> ${cohortName}</p>
      </div>
    </div>

    <table>
      <thead>
        <tr>
          <th style="width: 80px;">Code</th>
          <th>Teaching Module & Course Title</th>
          <th style="text-align: center; width: 60px;">ECTS</th>
          <th style="text-align: center; width: 50px;">Coeff</th>
          <th style="text-align: center; width: 85px;">Grade /20</th>
          <th style="text-align: center; width: 95px;">Result</th>
          <th>Lead Professor</th>
        </tr>
      </thead>
      <tbody>
        ${rowsHtml}
      </tbody>
    </table>

    <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 16px; margin-bottom: 25px;">
      <div style="background: #f1f5f9; border: 1px solid #cbd5e1; padding: 12px; border-radius: 4px; font-size: 9pt;">
        <div style="display: flex; justify-content: space-between; margin-bottom: 6px;">
          <span>Total Coefficient Sum:</span>
          <strong>${totalCoeff}</strong>
        </div>
        <div style="display: flex; justify-content: space-between; margin-bottom: 6px;">
          <span>Validated ECTS Credits:</span>
          <strong>${validatedEcts} / ${totalEcts} ECTS</strong>
        </div>
        <div style="display: flex; justify-content: space-between; font-size: 11pt; color: #0f172a; border-top: 1px solid #cbd5e1; padding-top: 6px;">
          <span>Weighted General Average:</span>
          <strong style="color: #0f172a;">${overallAverage} / 20.00</strong>
        </div>
      </div>

      <div style="background: #f0fdf4; border: 1px solid #86efac; padding: 12px; border-radius: 4px; font-size: 9pt; display: flex; flex-direction: column; justify-content: center;">
        <div style="color: #166534; font-size: 8pt; text-transform: uppercase; font-weight: 700;">Jury Deliberation Decision</div>
        <div style="font-size: 12pt; font-weight: 800; color: #15803d; margin-top: 4px;">
          ${juryVerdict}
        </div>
        <div style="font-size: 8pt; color: #166534; margin-top: 2px;">
          Academic committee deliberation closed on ${deliberationDate}.
        </div>
      </div>
    </div>

    <div class="signature-grid">
      <div class="signature-box">
        <div class="signature-title">President of the Examination Board</div>
        <div style="font-size: 8pt; color: #475569;">Certified compliant with official examination rules and academic regulations.</div>
        <div style="border-top: 1px solid #cbd5e1; padding-top: 4px; font-size: 8pt; display: flex; justify-content: space-between;">
          <span>Prof. Alan Sterling, Ph.D.</span>
          <span>Signature & Date</span>
        </div>
      </div>

      <div class="signature-box">
        <div class="signature-title">Registrar & Institutional Seal</div>
        <div style="display: flex; justify-content: space-between; align-items: center;">
          <div class="official-stamp">
            ONIXE ACADEMY<br/>EXAMINATION JURY
          </div>
          <div style="font-size: 7.5pt; color: #64748b; text-align: right;">
            Verification Hash:<br/>
            0x7D91A...34EF8
          </div>
        </div>
        <div style="border-top: 1px solid #cbd5e1; padding-top: 4px; font-size: 8pt; display: flex; justify-content: space-between;">
          <span>Office of the Registrar</span>
          <span>Official Grade Record</span>
        </div>
      </div>
    </div>

    <footer class="doc-footer">
      <div>Any alteration or falsification renders this document null and void. Verification available at onixe.edu/verify.</div>
      <div>Page 1 / 1</div>
    </footer>
  `;
}
