export interface DiplomaAttestationOptions {
  studentName: string;
  studentId: string;
  birthDate: string;
  birthPlace: string;
  diplomaTitle: string;
  specialization: string;
  rncpLevel: string; // e.g. "Level 7 (Master Degree Equivalent, Bac+5)"
  ectsCredits: number;
  honors: string; // e.g. "Summa Cum Laude / Félicitations du Jury"
  juryDate: string;
  certificateHash: string;
}

export function generateDiplomaAttestationHtml({
  studentName,
  studentId,
  birthDate,
  birthPlace,
  diplomaTitle,
  specialization,
  rncpLevel,
  ectsCredits = 120,
  honors = "Honors (Mention Très Bien)",
  juryDate,
  certificateHash,
}: DiplomaAttestationOptions): string {
  const currentDate = new Date().toLocaleDateString("en-GB", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  return `
    <div style="border: 6px double #0f172a; padding: 25px; border-radius: 8px; background: #ffffff;">
      <header class="doc-header" style="border-bottom: 2px solid #0f172a; margin-bottom: 25px;">
        <div class="doc-brand">
          <div class="doc-org-name" style="font-size: 18pt;">ONIXE INSTITUTE OF TECHNOLOGY</div>
          <div class="doc-org-sub" style="font-size: 9pt;">Academy of Advanced Computer Sciences & Emerging Pedagogies</div>
          <div class="doc-org-sub">Accredited by the Ministry of Higher Education & France Compétences</div>
        </div>
        <div class="doc-meta" style="text-align: right;">
          <div><strong>Credential Ref:</strong> ${certificateHash}</div>
          <div><strong>Delivery Date:</strong> ${currentDate}</div>
          <div><strong>ECTS Credits:</strong> ${ectsCredits} ECTS</div>
        </div>
      </header>

      <div style="text-align: center; margin: 25px 0 35px 0;">
        <div style="font-size: 10pt; text-transform: uppercase; letter-spacing: 0.2em; color: #475569; margin-bottom: 8px;">
          RÉPUBLIQUE FRANÇAISE — ENSEIGNEMENT SUPÉRIEUR
        </div>
        <div style="font-size: 22pt; font-weight: 900; letter-spacing: 0.05em; color: #0f172a; text-transform: uppercase; line-height: 1.2;">
          PROVISIONAL ATTESTATION OF GRADUATION
        </div>
        <div style="font-size: 12pt; color: #334155; font-weight: 600; margin-top: 6px;">
          ATTESTATION OFFICIELLE DE RÉUSSITE AU DIPLÔME
        </div>
      </div>

      <div style="font-size: 11.5pt; line-height: 1.8; text-align: center; margin: 0 auto 30px auto; max-width: 90%; color: #1e293b;">
        <p>In accordance with the deliberation of the Academic Examination Board dated <strong>${juryDate}</strong>,</p>
        
        <p style="margin-top: 15px;">The Title and Degree of:</p>
        <p style="font-size: 16pt; font-weight: 800; color: #0f172a; text-transform: uppercase; margin: 8px 0; letter-spacing: 0.02em;">
          ${diplomaTitle}
        </p>
        <p style="font-size: 11pt; color: #475569; font-style: italic;">
          Specialization: ${specialization} — Recognized Level: ${rncpLevel}
        </p>

        <p style="margin-top: 20px;">Is officially conferred upon:</p>
        <p style="font-size: 19pt; font-weight: 900; color: #0f172a; text-transform: uppercase; margin: 8px 0;">
          ${studentName}
        </p>
        <p style="font-size: 10pt; color: #64748b;">
          Born on ${birthDate} in ${birthPlace} | Student ID: ${studentId}
        </p>

        <div style="display: inline-block; margin-top: 18px; background: #f0fdf4; border: 1px solid #86efac; padding: 6px 20px; border-radius: 9999px; font-weight: 700; color: #15803d; font-size: 10.5pt;">
          Graduated with ${honors}
        </div>
      </div>

      <div class="signature-grid" style="margin-top: 35px;">
        <div class="signature-box" style="height: 130px;">
          <div class="signature-title">President of the Examination Jury</div>
          <div style="font-size: 8pt; color: #475569;">Validated and confirmed in accordance with state qualification standards.</div>
          <div style="border-top: 1px solid #cbd5e1; padding-top: 4px; font-size: 8pt; display: flex; justify-content: space-between;">
            <span>Prof. Marcus Vance, Ph.D.</span>
            <span>Jury Chairman</span>
          </div>
        </div>

        <div class="signature-box" style="height: 130px;">
          <div class="signature-title">General Academic Director</div>
          <div style="display: flex; justify-content: space-between; align-items: center;">
            <div class="official-stamp" style="padding: 10px 16px; font-size: 8.5pt;">
              ONIXE ACADEMY<br/>STATE ACCREDITED
            </div>
            <div style="font-size: 7.5pt; color: #64748b; text-align: right;">
              Cryptographic Hash:<br/>
              <code>${certificateHash}</code>
            </div>
          </div>
          <div style="border-top: 1px solid #cbd5e1; padding-top: 4px; font-size: 8pt; display: flex; justify-content: space-between;">
            <span>Dr. Elena Rostova</span>
            <span>Dean of Academy</span>
          </div>
        </div>
      </div>

      <footer class="doc-footer" style="margin-top: 30px;">
        <div>Certified digital document issued by Onixe Learning OS. Permanent verification at onixe.edu/verify/${certificateHash}</div>
        <div>Security Ref: SHA-256 Validated</div>
      </footer>
    </div>
  `;
}
