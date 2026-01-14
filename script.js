$(function () {
  // ========================================
  // Navigation & Progress Bar
  // ========================================

  const $window = $(window);
  const $links = $('.topnav .nav');
  const sectionIds = $links.map(function () {
    return $(this).attr('href');
  }).get();

  // Update active nav link and progress bar on scroll
  function updateNavAndProgress() {
    // Determine current section
    let currentSection = null;
    const scrollPos = $window.scrollTop();

    sectionIds.forEach(id => {
      const $section = $(id);
      if ($section.length && scrollPos >= $section.offset().top - 140) {
        currentSection = id;
      }
    });

    // Update active nav state
    $links.removeClass('active');
    if (currentSection) {
      $links.filter(`[href="${currentSection}"]`).addClass('active');
    }

    // Update progress bar
    const docHeight = $(document).height() - $window.height();
    const scrollPercent = (scrollPos / (docHeight || 1)) * 100;
    $('.progress .bar').css('width', Math.min(scrollPercent, 100) + '%');
  }

  // Throttled scroll handler for performance
  let scrollTimeout;
  $window.on('scroll', function () {
    if (scrollTimeout) {
      window.clearTimeout(scrollTimeout);
    }
    scrollTimeout = window.setTimeout(updateNavAndProgress, 10);
  });

  // Initial call
  updateNavAndProgress();

  // ========================================
  // Smooth Scroll Enhancement
  // ========================================

  $('a[href^="#"]').on('click', function (e) {
    const target = $(this).attr('href');
    if (target && target !== '#' && $(target).length) {
      e.preventDefault();
      $('html, body').animate({
        scrollTop: $(target).offset().top - 80
      }, 600, 'swing');
    }
  });

  // ========================================
  // Tabs Component
  // ========================================

  $('.tab-btn').on('click', function () {
    const $btn = $(this);
    const panelId = $btn.attr('aria-controls');

    // Update button states
    $btn
      .addClass('is-active')
      .attr('aria-selected', 'true')
      .siblings('.tab-btn')
      .removeClass('is-active')
      .attr('aria-selected', 'false');

    // Update panel visibility
    $('#' + panelId)
      .addClass('is-active')
      .attr('aria-hidden', 'false')
      .siblings('.tab-panel')
      .removeClass('is-active')
      .attr('aria-hidden', 'true');
  });

  // ========================================
  // Accordion Component
  // ========================================

  $('.acc-btn').on('click', function () {
    const $btn = $(this);
    const $panel = $btn.next('.acc-panel');
    const isOpen = $btn.hasClass('open');

    // Toggle state
    $btn
      .toggleClass('open')
      .attr('aria-expanded', !isOpen);

    // Animate panel
    $panel.slideToggle(250, 'swing');
  });

  // ========================================
  // Interactive Comparison Feature
  // ========================================

  const featureContent = {
    ugc: {
      title: "User-Generated Content Revolution",
      text: "Web 2.0 transformed users from passive consumers into active creators. Platforms like YouTube (founded 2005) enabled anyone to broadcast video content, democratizing media production. Wikipedia demonstrated that collaborative knowledge creation could rival professionally edited encyclopedias. By 2024, user-generated content represents the majority of internet traffic, with creators on platforms like TikTok, Instagram, and Twitch building professional careers. This shift generated powerful network effects—each new user made platforms more valuable, creating winner-take-all dynamics that concentrated power among a few dominant platforms.",
      icon: "👥"
    },
    api: {
      title: "APIs & The Programmable Web",
      text: "Application Programming Interfaces (APIs) transformed the web into a platform for innovation. Developers could combine services—Google Maps + restaurant listings + user reviews—creating mashups that exceeded what any single company could build. Twitter's API spawned entire ecosystems of third-party applications. This openness accelerated innovation cycles and enabled new business models. However, as platforms matured and sought greater control, many restricted or monetized API access, arguably closing the 'open' web they helped create. The debate continues about whether the web should be an open platform or a collection of walled gardens.",
      icon: "🔌"
    },
    social: {
      title: "Social Networks & Global Connection",
      text: "Facebook (2004), Twitter (2006), and later Instagram (2010) and TikTok (2016) redefined human connection. These platforms created digital town squares where billions gather daily, enabling instant global communication and social movements like Arab Spring and #MeToo. Social networks demonstrated unprecedented power to organize communities and spread information rapidly. However, they also enabled echo chambers, filter bubbles, and the rapid spread of misinformation. The double-edged nature of social media—connecting yet dividing, empowering yet manipulating—remains one of Web 2.0's most complex legacies.",
      icon: "🌐"
    },
    attention: {
      title: "The Attention Economy & Its Consequences",
      text: "When products became 'free,' attention became the commodity. Platforms optimized for 'engagement'—time spent and ads viewed. Algorithms learned to serve content triggering dopamine responses: novelty, social validation, moral outrage. This optimization raised serious concerns about mental health (especially among teens), political polarization, and the quality of public discourse. The 'attention economy' debate intensified after revelations about algorithmic amplification of extremist content and addictive design patterns. Calls for regulation grew, with some advocating for ethical design standards and others pushing for fundamental restructuring of platform business models away from advertising dependency.",
      icon: "⚡"
    }
  };

  $('.compare-btn').on('click', function () {
    const $btn = $(this);
    const feature = $btn.data('feature');
    const content = featureContent[feature];

    if (!content) return;

    // Update button states
    $('.compare-btn').removeClass('active');
    $btn.addClass('active');

    // Update display panel
    const $display = $('#feature-display');
    $display.fadeOut(200, function () {
      $display.html(`
        <div style="display: flex; align-items: start; gap: 1rem;">
          <span style="font-size: 2rem; flex-shrink: 0;">${content.icon}</span>
          <div>
            <h4 style="margin: 0 0 0.75rem; color: var(--accent-cyan); font-size: 1.15rem;">${content.title}</h4>
            <p style="margin: 0; line-height: 1.7; color: var(--text-secondary);">${content.text}</p>
          </div>
        </div>
      `);
      $display.fadeIn(200);
    });
  });

  // ========================================
  // Quiz Component
  // ========================================

  $('#quiz-form').on('submit', function (e) {
    e.preventDefault();

    const answer = $('input[name="q1"]:checked').val();
    const $result = $('#quiz-result');

    if (!answer) {
      $result
        .text('⚠️ Please select an answer first')
        .css('color', '#fbbf24');
      return;
    }

    if (answer === 'c') {
      $result
        .html('✅ <strong>Correct!</strong> Blockchain technology is indeed the foundational innovation enabling Web 3.0\'s vision of decentralized identity and user-owned digital assets.')
        .css('color', 'var(--accent-cyan)');
    } else {
      $result
        .html('❌ Not quite. The correct answer is blockchain technology. Try reviewing the Web 3.0 section for more details.')
        .css('color', '#f87171');
    }
  });

  // ========================================
  // Accessibility Enhancements
  // ========================================

  // Keyboard navigation for custom components
  $('.tab-btn, .acc-btn, .compare-btn').on('keydown', function (e) {
    // Enter or Space triggers click
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      $(this).click();
    }
  });

  // Focus management for tabs
  $('.tab-btn').on('keydown', function (e) {
    const $tabs = $('.tab-btn');
    const index = $tabs.index(this);

    if (e.key === 'ArrowRight' || e.key === 'ArrowLeft') {
      e.preventDefault();
      let newIndex;

      if (e.key === 'ArrowRight') {
        newIndex = (index + 1) % $tabs.length;
      } else {
        newIndex = (index - 1 + $tabs.length) % $tabs.length;
      }

      $tabs.eq(newIndex).focus().click();
    }
  });

  // ========================================
  // Performance & Polish
  // ========================================

  // Lazy load images when they enter viewport
  if ('IntersectionObserver' in window) {
    const imageObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const $img = $(entry.target);
          const src = $img.data('src');
          if (src) {
            $img.attr('src', src);
            imageObserver.unobserve(entry.target);
          }
        }
      });
    });

    $('img[data-src]').each(function () {
      imageObserver.observe(this);
    });
  }

  // Animate elements on scroll
  if ('IntersectionObserver' in window) {
    const animateObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          $(entry.target).addClass('animate-in');
        }
      });
    }, {
      threshold: 0.1
    });

    $('.section, .image-content, .stats-box, .pullquote').each(function () {
      animateObserver.observe(this);
    });
  }

  // ========================================
  // Console Easter Egg
  // ========================================

  console.log('%c🌐 Web Evolution Project', 'font-size: 20px; font-weight: bold; color: #7aa2ff;');
  console.log('%cFrom Web 1.0\'s static pages to Web 3.0\'s decentralized future', 'font-size: 12px; color: #7affd1;');
  console.log('%c\nBuilt with ❤️ using HTML5, CSS3, and jQuery\nMMCC2041 • Farhan Adib • 2025', 'font-size: 11px; color: #b6c5e1;');

  // ========================================
  // Development Helper
  // ========================================

  // Log word count in console for verification
  const wordCount = $('article').text().split(/\s+/).filter(word => word.length > 0).length;
  console.log(`📊 Content Statistics: ~${wordCount} words`);
});
