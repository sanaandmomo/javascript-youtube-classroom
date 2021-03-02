const { getVideos } = require('../../src/js/utils/youtube');

describe('유튜브 강의실 영상 검색 모달', () => {
  beforeEach(() => {
    cy.visit('http://localhost:5500/');
  });

  it('검색어에 맞게 데이터를 잘 가져오는지 확인한다.', () => {
    const searchTerm = '서니';
    getVideos(searchTerm).then(res => {
      expect(res.status).to.equal(200)
    });
  })

  it('사용자가 검색 버튼을 누르고, 검색어를 입력하고, 검색 버튼을 눌렀을 때, 검색 결과가 화면에 나타난다.', () => {
    const searchTerm = '서니';

    cy.get('#search-button').click();
    cy.get('#youtube-search-input').type(searchTerm);
    cy.get('#youtube-search-button').click();

    // TODO : cypress 로 데이터 요청 이후 테스트 하는 방법으로 교체하기
    cy.wait(5000);

    cy.get('.clip').its('length').should('be.gt', 0);
    cy.get('.clip').its('length').should('be.lte', 10);
  })

  it('사용자가 검색어를 입력하고 검색 버튼을 눌렀을 때, 최근 검색어에 추가 된다.', () => {
    const searchTerm = '서니';
    const searchTerm1 = '도비';
    const searchTerm2 = '하루';

    cy.get('#search-button').click();
    cy.get('#youtube-search-input').type(searchTerm);
    cy.get('#youtube-search-button').click();

    cy.get('.chip').first().should('have.text', searchTerm);

    cy.get('#youtube-search-input').type(searchTerm1);
    cy.get('#youtube-search-button').click();

    cy.get('.chip').first().should('have.text', searchTerm1);

    cy.get('#youtube-search-input').type(searchTerm2);
    cy.get('#youtube-search-button').click();

    cy.get('.chip').first().should('have.text', searchTerm2);
  })

  it('사용자가 검색어를 아무것도 입력하지 않았을 때, 아무반응도 일어나지 않는다.', () => {
    const searchTerm = '  ';

    cy.get('#search-button').click();
    cy.get('#youtube-search-input').type(searchTerm);
    cy.get('#youtube-search-button').click();

    cy.get('.chip').first().should('not.have.text', searchTerm);
  })

  it('사용자가 영상 저장 버튼을 누르면, 해당 저장 버튼이 사라지고, 우측 위 저장된 영상 개수가 1 증가한다.', () => {
    const searchTerm = '서니';
    cy.get('#saved-video-count').invoke('text').then($el => {
      const prevSavedVideoCount = $el;
      cy.get('#search-button').click();
      cy.get('#youtube-search-input').type(searchTerm);
      cy.get('#youtube-search-button').click();

      cy.get('.js-save-btn').first().click();

      cy.get('.js-save-btn').should('not.be.visible');
      cy.get('#saved-video-count').should('have.text', `${Number(prevSavedVideoCount) + 1}`)
    });
  })
});