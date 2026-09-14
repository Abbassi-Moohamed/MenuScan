export interface Dictionary {
  order: {
    addToCart: string; openCart: string; closeCart: string; cartTitle: string; emptyCart: string;
    decrease: string; increase: string; total: string; tableNumber: string; tablePlaceholder: string; addedToCart: string; viewOrder: string;
    submit: string; submitting: string; invalidCheckout: string; submitError: string; statusLink: string;
    confirmationTitle: string; confirmationMessage: string; status: string; statusPending: string;
    statusConfirmed: string; statusRejected: string; statusReady: string; statusCompleted: string;
    refresh: string; orderNotFound: string;
  };
  header: {
    status: string;
    statusTitle: string;
  };
  landing: {
    eyebrow: string;
    message: string;
  };
  explore: {
    eyebrow: string;
    title: string;
    menuSummaryAriaLabel: string;
    categoriesLabel: (count: number) => string;
    itemsLabel: (count: number) => string;
    categoriesAriaLabel: string;
    emptyTitle: string;
    emptyMessage: string;
  };
  sheet: {
    itemsCountLabel: (count: number) => string;
    backLabel: string;
    dialogAriaLabel: (name: string) => string;
    emptyTitle: string;
    emptyMessage: string;
    errorTitle: string;
    errorMessage: string;
    retryLabel: string;
  };
  menuItem: {
    promotion: string;
    unavailable: string;
  };
  backToTop: {
    label: string;
  };
  footer: {
    note: string;
    noteCta: string;
    noteCtaStrong: string;
    meta: string;
  };
  a11y: {
    skipLink: string;
  };
  notFound: {
    eyebrow: string;
    title: string;
    message: string;
    categoryTitle: string;
    categoryMessage: string;
    cta: string;
  };
  unavailable: {
    eyebrow: string;
    title: string;
    message: string;
    retry: string;
  };
  admin: {
    chrome: {
      appTitle: string;
      roleApp: string;
      roleCoffee: string;
      logout: string;
      viewPublicMenu: string;
    };
    gate: {
      title: string;
      appSubtitle: string;
      coffeeSubtitle: string;
      label: string;
      verify: string;
      verifying: string;
      invalidPin: string;
      coffeeNotFound: string;
      genericError: string;
    };
    app: {
      coffeesTitle: string;
      coffeesHint: string;
      createCoffee: string;
      emptyTitle: string;
      emptyMessage: string;
      categoryCount: (count: number) => string;
      openMenu: string;
      edit: string;
      resetPin: string;
      resetPinDialogTitle: string;
      resetPinDialogText: string;
      resetPinDone: string;
    };
    coffeeForm: {
      createTitle: string;
      editTitle: string;
      name: string;
      namePlaceholder: string;
      logo: string;
      logoPlaceholder: string;
      logoHint: string;
      logoPreview: string;
      logoUploadFailed: string;
      cover: string;
      coverPlaceholder: string;
      coverHint: string;
      coverPreview: string;
      slug: string;
      slugHint: string;
      slugInvalid: string;
      save: string;
      saving: string;
      cancel: string;
      nameRequired: string;
      logoRequired: string;
      urlInvalid: string;
      created: (name: string) => string;
      updated: (name: string) => string;
    };
    delete: {
      coffeeTitle: (name: string) => string;
      coffeeMessage: string;
      categoryTitle: (name: string) => string;
      categoryMessage: string;
      itemTitle: (name: string) => string;
      itemMessage: string;
      deleted: (name: string) => string;
      confirm: string;
      cancel: string;
      deleting: string;
    };
    categories: {
      title: string;
      add: string;
      edit: string;
      emptyTitle: string;
      emptyMessage: string;
      itemCount: (count: number) => string;
      itemsAria: string;
      loadError: string;
      createTitle: string;
      editTitle: string;
      name: string;
      namePlaceholder: string;
      nameRequired: string;
      image: string;
      imagePlaceholder: string;
      imagePreview: string;
      uploadFailed: string;
      imageHint: string;
      urlInvalid: string;
      saved: (name: string) => string;
    };
    items: {
      title: string;
      back: string;
      ofCategory: (name: string) => string;
      add: string;
      edit: string;
      emptyTitle: string;
      emptyMessage: string;
      loadError: string;
      createTitle: string;
      editTitle: string;
      name: string;
      namePlaceholder: string;
      description: string;
      descriptionPlaceholder: string;
      price: string;
      pricePlaceholder: string;
      image: string;
      imagePlaceholder: string;
      imagePreview: string;
      uploadFailed: string;
      imageHint: string;
      nameRequired: string;
      priceInvalid: string;
      promotion: string;
      promotionPlaceholder: string;
      promotionHint: string;
      promotionInvalid: string;
      availability: string;
      available: string;
      unavailable: string;
      urlInvalid: string;
      saved: (name: string) => string;
    };
    navigation: {
      menu: string;
      orders: string;
      settings: string;
      profile: string;
      security: string;
    };
    orders: {
      title: string;
      pending: string;
      confirmed: string;
      rejected: string;
      ready: string;
      all: string;
      empty: string;
      confirm: string;
      reject: string;
      tableNumber: string;
    };
    settings: {
      title: string;
      intro: string;
    };
    pin: {
      title: string;
      intro: string;
      current: string;
      newPin: string;
      confirm: string;
      save: string;
      saving: string;
      mismatch: string;
      sameAsCurrent: string;
      invalid: string;
      changed: string;
    };
    errors: {
      sessionExpired: string;
      forbidden: string;
      notFound: string;
      conflict: string;
      validation: string;
      server: string;
      network: string;
      loadFailed: string;
      retry: string;
      wrongCoffee: string;
      wrongCoffeeMessage: string;
    };
  };
}