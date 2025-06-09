import { StructureBuilder } from 'sanity/structure'

export const structure = (S: StructureBuilder) =>
  S.list()
    .title('Content')
    .items([
      // Notes & Question Bank Section
      S.listItem()
        .title('Notes & Question Bank')
        .child(
          S.list()
            .title('Notes & Question Bank')
            .items([
              // Notes Section
              S.listItem()
                .title('Notes')
                .child(
                  S.list()
                    .title('Notes')
                    .items([
                      // CIE IGCSE Notes Section
                      S.listItem()
                        .title('CIE IGCSE Notes')
                        .child(
                          S.list()
                            .title('CIE IGCSE Content')
                            .items([
                              // Homepage Section
                              S.listItem()
                                .title('Homepage')
                                .child(
                                  S.list()
                                    .title('Homepage Sections')
                                    .items([
                                      // Hero Section
                                      S.listItem()
                                        .title('Hero Section')
                                        .child(
                                          S.documentTypeList('hero')
                                            .title('Hero Section')
                                            .filter('_type == "hero"')
                                        ),
                                      
                                      // Subject Grid Section
                                      S.listItem()
                                        .title('Subject Grid Section')
                                        .child(
                                          S.documentTypeList('subjectGrid')
                                            .title('Subject Grid Section')
                                            .filter('_type == "subjectGrid"')
                                        ),
                                      
                                      // Subject Request Section
                                      S.listItem()
                                        .title('Subject Request Section')
                                        .child(
                                          S.documentTypeList('subjectRequest')
                                            .title('Subject Request Section')
                                            .filter('_type == "subjectRequest"')
                                        ),
                                      
                                      // Why Choose Us Section
                                      S.listItem()
                                        .title('Why Choose Us Section')
                                        .child(
                                          S.documentTypeList('whyChooseUs')
                                            .title('Why Choose Us Section')
                                            .filter('_type == "whyChooseUs"')
                                        ),
                                      
                                      // FAQ Section
                                      S.listItem()
                                        .title('FAQ Section')
                                        .child(
                                          S.documentTypeList('faq')
                                            .title('FAQ Section')
                                            .filter('_type == "faq"')
                                        ),
                                      
                                      // Contact Form Section
                                      S.listItem()
                                        .title('Contact Form Section')
                                        .child(
                                          S.documentTypeList('contactFormSection')
                                            .title('Contact Form Section')
                                            .filter('_type == "contactFormSection"')
                                        ),
                                      
                                      // Contact Form Submissions
                                      S.listItem()
                                        .title('Contact Form Submissions')
                                        .child(
                                          S.documentTypeList('contactForm')
                                            .title('Contact Form Submissions')
                                            .filter('_type == "contactForm"')
                                        ),
                                      
                                      // SEO Settings
                                      S.listItem()
                                        .title('SEO Settings')
                                        .child(
                                          S.documentTypeList('homepageSEO')
                                            .title('SEO Settings')
                                            .filter('_type == "homepageSEO"')
                                        ),
                                    ])
                                ),
                              
                              // Subject Pages
                              S.listItem()
                                .title('Subject Pages')
                                .child(
                                  S.documentTypeList('subjectPage')
                                    .title('Subject Pages')
                                    .filter('_type == "subjectPage"')
                                ),
                              
                              // Header
                              S.listItem()
                                .title('Header')
                                .child(
                                  S.documentTypeList('header')
                                    .title('Header')
                                    .filter('_type == "header"')
                                ),
                              
                              // Footer
                              S.listItem()
                                .title('Footer')
                                .child(
                                  S.documentTypeList('footer')
                                    .title('Footer')
                                    .filter('_type == "footer"')
                                ),
                            ])
                        ),
                    ])
                ),
              
              // Question Bank Section (Empty folder for now)
              S.listItem()
                .title('Question Bank')
                .child(
                  S.list()
                    .title('Question Bank')
                    .items([])
                ),
            ])
        ),

      // Past Papers Section (Empty folder for now)
      S.listItem()
        .title('Past Papers')
        .child(
          S.list()
            .title('Past Papers')
            .items([])
        ),

      // Affiliate Websites Section (Empty folder for now)
      S.listItem()
        .title('Affiliate Websites')
        .child(
          S.list()
            .title('Affiliate Websites')
            .items([])
        ),
    ]) 