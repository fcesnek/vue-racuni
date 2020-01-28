import Api from '@/services/Api';

export default {
  list() {
    return Api().get('bills/list');
  },
  new(bills) {
    return Api().post('bills/new', bills);
  },
  remove(billNumber) {
    return Api().delete('bills/remove', { params: { billNumber } });
  },
};
