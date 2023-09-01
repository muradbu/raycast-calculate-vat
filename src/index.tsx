import { Form, ActionPanel, Action, showToast } from "@raycast/api";
import countries from "./countries.json";

type Values = {
  price: number;
  taxRate: number;
  included: boolean;
};

export default function Command() {
  function handleSubmit(values: Values) {
    const result = calculateVAT(values.price, values.taxRate, values.included);
    const vat = Math.round(result * 100) / 100;

    showToast({ title: vat.toString() });
  }

  function calculateVAT(price: number, taxRate: number, included: boolean) {
    if (included) {
      return price - price / (1 + taxRate / 100);
    } else {
      return price * (taxRate / 100);
    }
  }

  return (
    <Form
      actions={
        <ActionPanel>
          <Action.SubmitForm onSubmit={handleSubmit} />
        </ActionPanel>
      }
    >
      <Form.TextField id="price" title="Price" placeholder="Enter price" />
      <Form.Dropdown id="taxRate" title="Tax Rate">
        {countries.map((country) => (
          <Form.Dropdown.Section key={country.countryCode} title={`${country.fullName} (${country.countryCode})`}>
            {country.taxRates.map((taxRate) => (
              <Form.Dropdown.Item key={taxRate} title={taxRate + "%"} value={taxRate.toString()} icon={country.flag} />
            ))}
          </Form.Dropdown.Section>
        ))}
      </Form.Dropdown>

      <Form.Checkbox id="included" title="Included" label="Check if the price has VAT included" storeValue />
    </Form>
  );
}
