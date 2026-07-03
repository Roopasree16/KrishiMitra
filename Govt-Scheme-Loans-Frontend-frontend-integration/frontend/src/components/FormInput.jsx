import { UI_TEXT } from "../translations/ui";

export default function FormInput({ onSubmit, language }) {
  const t = UI_TEXT[language];

  const handleSubmit = (e) => {
    e.preventDefault();

    const payload = {
      cropType: e.target.cropType.value,
      lossType: e.target.lossType.value,
      lossSeverity: e.target.lossSeverity.value,
      state: e.target.state.value,
    };

    if (e.target.detectedDisease.value) {
      payload.detectedDisease = e.target.detectedDisease.value;
    }

    if (e.target.landholdingCategory.value) {
      payload.landholdingCategory = e.target.landholdingCategory.value;
    }

    onSubmit(payload);
  };

  return (
    <form onSubmit={handleSubmit}>
      <input name="cropType" placeholder={t.cropType} required />

      <select name="lossType" required>
        <option value="">{t.lossType}</option>
        <option value="disease">{t.lossTypes.disease}</option>
        <option value="pest">{t.lossTypes.pest}</option>
        <option value="flood">{t.lossTypes.flood}</option>
        <option value="drought">{t.lossTypes.drought}</option>
      </select>

      <select name="lossSeverity" required>
        <option value="">{t.lossSeverity}</option>
        <option value="low">{t.severity.low}</option>
        <option value="medium">{t.severity.medium}</option>
        <option value="high">{t.severity.high}</option>
      </select>

      <input name="state" placeholder={t.state} required />

      <input
        name="detectedDisease"
        placeholder={t.detectedDisease}
      />

      <select name="landholdingCategory">
        <option value="">{t.landholdingCategory}</option>
        <option value="marginal">{t.landholding.marginal}</option>
        <option value="small">{t.landholding.small}</option>
        <option value="others">{t.landholding.others}</option>
      </select>

      <button type="submit">{t.checkEligibility}</button>
    </form>
  );
}
