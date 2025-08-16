// SEO Configuration for Water Park Chalo
export const seoConfig = {
  home: {
    title: "Water Park Chalo  Find & Book the Best Water Parks in India",
    description: "Welcome to Water Park Chalo - Your ultimate destination to discover, explore, and book the best water parks in India. Compare attractions, ticket prices, and facilities for a perfect fun-filled day.",
    keywords: "Water Park Chalo, water parks in India, best water parks, water park tickets, rides, slides, amusement parks, family fun, swimming pools, water adventures",
    url: "https://waterparkchalo.com/",
    image: "/logo.png",
    structuredData: {
      "@context": "https://schema.org",
      "@type": "WebSite",
      "name": "Water Park Chalo",
      "alternateName": ["Water Park Chalo", "WaterParkChalo.com", "Water Park Booking"],
      "url": "https://waterparkchalo.com",
      "description": "Discover and book the best water parks in India with Water Park Chalo.",
      "brand": {
        "@type": "Brand",
        "name": "Water Park Chalo",
        "alternateName": "Water Park Chalo",
        "logo": "https://waterparkchalo.com/logo.png",
        "slogan": "Your Splash Starts Here!"
      },
      "potentialAction": {
        "@type": "SearchAction",
        "target": "https://waterparkchalo.com/search?query={search_term_string}",
        "query-input": "required name=search_term_string"
      }
    }
  },
  
  shop: {
    title: "Book Water Park Tickets & Passes | Water Park Chalo",
    description: "Browse and book tickets to top water parks across India. Find family-friendly parks, thrilling rides, and exciting events — all in one place.",
    keywords: "book water park tickets, water park passes, best water parks, amusement parks, rides and slides, family fun",
    url: "https://waterparkchalo.com/shop",
    image: "/logo.png",
    structuredData: {
      "@context": "https://schema.org",
      "@type": "CollectionPage",
      "name": "Water Park Tickets",
      "description": "Browse and book water park tickets and passes online.",
      "url": "https://waterparkchalo.com/shop"
    }
  },
  
  about: {
    title: "About Water Park Chalo - Your Gateway to Fun & Adventure",
    description: "Learn about Water Park Chalo's mission to connect people with the best water park experiences in India. Discover how we make your day of fun effortless and unforgettable.",
    keywords: "about Water Park Chalo, our story, water park booking platform, mission, adventure, family fun",
    url: "https://waterparkchalo.com/about",
    image: "/mission.jpg",
    structuredData: {
      "@context": "https://schema.org",
      "@type": "AboutPage",
      "name": "About Water Park Chalo",
      "description": "Our mission is to help people find and book the best water park experiences in India."
    }
  },
  
  contact: {
    title: "Contact Water Park Chalo - Get in Touch",
    description: "Contact Water Park Chalo for customer support, booking assistance, partnership opportunities, or any queries related to water park visits.",
    keywords: "contact Water Park Chalo, customer support, booking help, water park inquiries, partnerships",
    url: "https://waterparkchalo.com/contact",
    image: "/logo.png",
    structuredData: {
      "@context": "https://schema.org",
      "@type": "ContactPage",
      "name": "Contact Water Park Chalo",
      "description": "Get in touch with Water Park Chalo for bookings and support."
    }
  },
  
  product: (product) => ({
    title: `${product.name} - Book Tickets | Water Park Chalo`,
    description: product.description || `Book tickets for ${product.name} at Water Park Chalo. Enjoy thrilling water rides, wave pools, and unforgettable fun.`,
    keywords: `${product.name}, water park tickets, rides, slides, swimming pools, amusement park, family fun`,
    url: `https://waterparkchalo.com/product/${product.id}`,
    image: product.images?.[0] || "/logo.png",
    type: "product",
    structuredData: {
      "@context": "https://schema.org",
      "@type": "Product",
      "name": product.name,
      "description": product.description || `Book tickets for ${product.name}`,
      "image": product.images || ["/logo.png"],
      "brand": {
        "@type": "Brand",
        "name": "Water Park Chalo"
      },
      "offers": {
        "@type": "Offer",
        "price": product.price,
        "priceCurrency": "INR",
        "availability": product.stock > 0 ? "https://schema.org/InStock" : "https://schema.org/OutOfStock",
        "url": `https://waterparkchalo.com/product/${product.id}`
      }
    }
  }),
  
  login: {
    title: "Login to Water Park Chalo | Manage Your Bookings",
    description: "Login to your Water Park Chalo account to view, manage, and track your water park bookings.",
    keywords: "login, Water Park Chalo account, booking login, ticket management",
    url: "https://waterparkchalo.com/login",
    image: "/logo.png"
  },
  
  signup: {
    title: "Sign Up for Water Park Chalo | Book Water Parks Online",
    description: "Create your Water Park Chalo account to book tickets, track orders, and access exclusive deals on water parks.",
    keywords: "sign up, create account, water park membership, online booking",
    url: "https://waterparkchalo.com/signup",
    image: "/logo.png"
  },
  
  policies: {
    title: "Policies & Terms | Water Park Chalo",
    description: "Read Water Park Chalo's terms, privacy policy, cancellation, and refund information for water park bookings.",
    keywords: "policies, terms of service, privacy policy, refund policy, cancellation policy, water park",
    url: "https://waterparkchalo.com/policies",
    image: "/logo.png"
  },
  
  seller: {
    title: "Partner with Us | Water Park Chalo",
    description: "List your water park on Water Park Chalo and reach thousands of visitors looking for their next fun adventure.",
    keywords: "partner with us, list water park, water park owners, booking platform partnership",
    url: "https://waterparkchalo.com/seller",
    image: "/seller.png"
  }
};

// Default SEO fallback
export const defaultSEO = {
  title: "Water Park Chalo - Discover & Book the Best Water Parks",
  description: "Find and book the best water parks in India with Water Park Chalo. Compare rides, ticket prices, and facilities for your perfect day out.",
  keywords: "water parks, book tickets, rides, slides, family fun, swimming pools",
  url: "https://waterparkchalo.com",
  image: "/logo.png"
};
