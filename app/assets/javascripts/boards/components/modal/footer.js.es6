//= require ./lists_dropdown
/* global Vue */
(() => {
  const ModalStore = gl.issueBoards.ModalStore;

  gl.issueBoards.ModalFooter = Vue.extend({
    props: [
      'bulkUpdatePath',
    ],
    data() {
      return ModalStore.store;
    },
    computed: {
      submitDisabled() {
        return !ModalStore.selectedCount();
      },
      submitText() {
        const count = ModalStore.selectedCount();

        return `Add ${count} issue${count > 1 || !count ? 's' : ''}`;
      },
    },
    methods: {
      hideModal() {
        this.showAddIssuesModal = false;
      },
      addIssues() {
        const list = this.selectedList;
        const issueIds = this.selectedIssues.map(issue => issue._id);

        // Post the data to the backend
        this.$http.post(this.bulkUpdatePath, {
          update: {
            issuable_ids: issueIds.join(','),
            add_label_ids: [list.label.id],
          },
        });

        // Add the issues on the frontend
        this.selectedIssues.forEach((issue) => {
          list.addIssue(issue);
          list.issuesSize += 1;
        });

        this.hideModal();
      },
    },
    components: {
      'lists-dropdown': gl.issueBoards.ModalFooterListsDropdown,
    },
    template: `
      <footer
        class="form-actions add-issues-footer">
        <div class="pull-left">
          <button
            class="btn btn-success"
            type="button"
            :disabled="submitDisabled"
            @click="addIssues">
            {{ submitText }}
          </button>
          <span class="inline add-issues-footer-to-list">
            to list
          </span>
          <lists-dropdown></lists-dropdown>
        </div>
        <button
          class="btn btn-default pull-right"
          type="button"
          @click="hideModal">
          Cancel
        </button>
      </footer>
    `,
  });
})();
