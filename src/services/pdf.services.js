import PDFDocument from "pdfkit";
import fs from "fs";
import path from "path";

/**
 * Génère une facture PDF pour un paiement
 * @param {Object} payement - objet Payement avec les infos nécessaires
 * @returns {Promise<string>} chemin vers le PDF généré
 */
export const generateInvoicePDF = async (payement) => {
  return new Promise((resolve, reject) => {
    try {
      const doc = new PDFDocument({ size: "A4", margin: 50 });
      const filePath = path.join(
        "invoices",
        `invoice_${payement._id}.pdf`
      );

      // Créer le dossier s'il n'existe pas
      fs.mkdirSync(path.dirname(filePath), { recursive: true });

      const stream = fs.createWriteStream(filePath);
      doc.pipe(stream);

      // ---- Contenu de la facture ----
      doc.fontSize(20).text("Facture de paiement", { align: "center" });
      doc.moveDown();

      doc.fontSize(12).text(`Boutique: ${payement.shop.shopName}`);
      doc.text(`Date: ${new Date(payement.date).toLocaleDateString()}`);
      doc.text(`Statut: ${payement.status}`);
      doc.moveDown();

      doc.text("Détails des charges payées:");
      payement.charges.forEach((charge) => {
        doc.text(`- ${charge.name}: ${charge.amount.toLocaleString()} Ar`);
      });

      const total = payement.charges.reduce(
        (sum, c) => sum + c.amount,
        0
      );
      doc.moveDown();
      doc.text(`Total payé: ${total.toLocaleString()} Ar`, { bold: true });

      doc.end();

      stream.on("finish", () => resolve(filePath));
      stream.on("error", (err) => reject(err));
    } catch (err) {
      reject(err);
    }
  });
};