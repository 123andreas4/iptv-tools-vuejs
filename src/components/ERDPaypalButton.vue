<template>
  <div :id="id"></div>
</template>

<script>
import { randomId } from "../plugins/utilities";

export default {
  props: {
    id: {
      type: [String, Number],
      default: () => randomId(),
    },
    buttonStyle: {
      type: Object,
      default: () => {
        return {
          label: "pay",
          size: "large",
          shape: "rect",
          color: "blue",
          tagline: false,
          fundingicons: true,
        };
      },
    },
    value: {
      type: [String, Number],
      default: "",
    },
    currency: {
      type: String,
      default: "EUR",
    },
    description: {
      type: String,
      default: "",
    },
    items: {
      type: Array,
      default: () => [],
    },
    brandName: {
      type: String,
      default: "IPTV-Tools by ERDesigns",
    },
  },
  methods: {
    createButton() {
      let vm = this;
      // eslint-disable-next-line no-undef
      paypal
        .Buttons({
          style: vm.buttonStyle,
          createOrder: function (data, actions) {
            return actions.order.create({
              application_context: {
                brand_name: vm.brandName,
                shipping_preference: "NO_SHIPPING",
                user_action: "PAY_NOW",
              },
              payee: {
                email_address: "contact@erdesigns.eu",
              },
              purchase_units: [
                {
                  amount: {
                    currency_code: "EUR",
                    value: vm.value,
                  },
                  description: vm.description,
                },
              ],
            });
          },
          onApprove: function (data, actions) {
            return actions.order.capture().then(function (details) {
              vm.$emit("approve", details);
            });
          },
          onCancel: function (data) {
            vm.$emit("cancel", data);
          },
          onError: function (error) {
            vm.$emit("error", error);
          },
        })
        .render(`#${vm.id}`);
    },
  },
  mounted() {
    this.createButton();
  },
};
</script>

<style>
.paypal-button {
}
</style>
