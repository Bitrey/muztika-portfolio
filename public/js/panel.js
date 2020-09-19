const password = prompt("Password");

const tableBody = $("#table-body");
// append to tableBody:
// <tr>
//     <th scope="col">Commission Num</th>
//     <th scope="col">Commission ID</th>
//     <th scope="col">Email</th>
//     <th scope="col">Body</th>
//     <th scope="col">Created At</th>
//     <th scope="col">Amount</th>
//     <th scope="col">Is Paid</th>
//     <th scope="col">Estimated Finish Date</th>
//     <th scope="col">Is Finished</th>
//     <th scope="col">Finished At</th>
//     <th scope="col">Payment Method</th>
// </tr>

const authorize = async () => {
    try {
        const { data } = await axios.get("/get-commissions", {
            params: { password }
        });
        tableBody.html("");
        for (const {
            _id,
            shortId,
            email,
            body,
            isFinished,
            finishedAt,
            paymentMethod,
            orderNumber,
            amount,
            estimatedFinishDate,
            isPaid,
            isCanceled,
            createdAt
        } of data) {
            const tableRow = $("<tr></tr>");
            tableRow.append(
                $(
                    `<td>${
                        orderNumber
                            ? `<span class="bg-info">${orderNumber}</span>`
                            : '<span class="bg-warning">Unindexed</span>'
                    }</td>`
                )
            );
            tableRow.append(
                $(
                    `<td><span class="bg-${
                        shortId || _id ? "info" : "danger text-white"
                    }">${shortId || _id}</span></td>`
                )
            );
            tableRow.append(
                $(
                    `<td><span class="bg-${
                        email ? "info" : "danger text-white"
                    }">${email}</span></td>`
                )
            );

            tableRow.append(
                $(
                    `<td><span class="bg-${
                        body ? "info" : "danger text-white"
                    }">${body}</span></td>`
                )
            );

            tableRow.append(
                $(
                    createdAt
                        ? `<td><span class="bg-info">${moment(createdAt).format(
                              "MMMM Do YYYY, h:mm:ss a"
                          )}</span></td>`
                        : '<td><span class="bg-danger">Unset</span></td>'
                )
            );

            tableRow.append(
                $(
                    `<td>${
                        amount
                            ? `<span class="bg-info">€${amount.toFixed(
                                  2
                              )}</span>`
                            : '<span class="bg-warning">Unset</span>'
                    }</td>`
                )
            );
            tableRow.append(
                $(
                    `<td>${
                        isPaid
                            ? `<span class="bg-success text-white">€${Boolean(
                                  isPaid
                              )}</span>`
                            : `<span class="bg-danger text-white">${Boolean(
                                  isPaid
                              )}</span>`
                    }</td>`
                )
            );
            tableRow.append(
                $(
                    `<td>${
                        estimatedFinishDate
                            ? `<span class="bg-info">${moment(
                                  estimatedFinishDate
                              ).format("MMMM Do YYYY, h:mm:ss a")}`
                            : '<span class="bg-warning">Unset</span>'
                    }</td>`
                )
            );
            tableRow.append(
                $(
                    `<td>${
                        isFinished
                            ? `<span class="bg-success text-white">€${Boolean(
                                  isFinished
                              )}</span>`
                            : `<span class="bg-danger text-white">${Boolean(
                                  isFinished
                              )}</span>`
                    }</td>`
                )
            );
            tableRow.append(
                $(
                    `<td>${
                        finishedAt
                            ? `<span class="bg-info">${moment(
                                  finishedAt
                              ).format("MMMM Do YYYY, h:mm:ss a")}`
                            : '<span class="bg-warning">Unset</span>'
                    }</td>`
                )
            );

            tableRow.append(
                $(
                    `<td>${
                        paymentMethod
                            ? `<span class="bg-info">€${paymentMethod}</span>`
                            : '<span class="bg-warning">Unset</span>'
                    }</td>`
                )
            );

            tableBody.append(tableRow);
        }
        if (data.length === 0) {
            alert("No commissions found!");
        }
    } catch (err) {
        if (err.response) {
            document.write(err.response.data);
        }
    }
};
authorize();
