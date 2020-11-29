const { RULE_CATEGORY } = require("../constants");
const { NodeUtils } = require("./utils");

const MESSAGE_IDS = {
  DUPLICATE_ID: "duplicateId",
};

module.exports = {
  meta: {
    type: "code",

    docs: {
      description: "Disallow to use duplicate id",
      category: RULE_CATEGORY.BEST_PRACTICE,
      recommended: true,
    },

    fixable: null,
    schema: [],
    messages: {
      [MESSAGE_IDS.DUPLICATE_ID]: "Unexpected duplicate id",
    },
  },

  create(context) {
    const IdAttrsMap = new Map();
    return {
      "*"(node) {
        const idAttr = NodeUtils.findAttr(node, "id");
        if (idAttr) {
          if (!IdAttrsMap.has(idAttr.value)) {
            IdAttrsMap.set(idAttr.value, []);
          }
          const nodes = IdAttrsMap.get(idAttr.value);
          nodes.push(idAttr);
        }
      },
      "Program:exit"() {
        IdAttrsMap.forEach((attrs) => {
          if (Array.isArray(attrs) && attrs.length > 1) {
            attrs.forEach((attr) => {
              context.report({
                node: attr,
                messageId: MESSAGE_IDS.DUPLICATE_ID,
              });
            });
          }
        });
      },
    };
  },
};
