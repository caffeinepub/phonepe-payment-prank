# Specification

## Summary
**Goal:** Redesign the payment success screen with a green/white split background and add sender payment details.

**Planned changes:**
- Update PaymentSuccess component background to show green in the top 1/3 and white in the bottom 2/3
- Add "Paid to [recipient name]" text at the top-center of the white section
- Keep the existing green checkmark tick circle unchanged
- Add "Paid from [Sender name]" text in the lower white section
- Add "HDFC Bank XXXX XXXX 7128" text below the sender name
- Add a Transaction ID field below the bank details for manual entry

**User-visible outcome:** Users will see a redesigned payment success screen with a two-tone green/white background displaying the recipient name at the top, followed by the checkmark, and sender payment details (name, bank account, and transaction ID field) in the lower section.
