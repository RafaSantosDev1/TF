using Backend.Domain;
using Backend.Domain.Enums;

namespace Backend.Domain.Repositories;

public interface IQuestionRepository
{
    Task<Question?> GetByIdAsync(Guid id, CancellationToken cancellationToken = default);

    Task<IEnumerable<Question>> GetAllAsync(CancellationToken cancellationToken = default);

    Task<IEnumerable<Question>> GetByAreaAsync(Area area, CancellationToken cancellationToken = default);

    Task<Question> AddAsync(Question question, CancellationToken cancellationToken = default);

    Task Update(Question question, CancellationToken cancellationToken = default);

    Task Delete(Question question, CancellationToken cancellationToken = default);

    Task<bool> ExistsAsync(Guid id, CancellationToken cancellationToken = default);
}