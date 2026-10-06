using Backend.Domain;

namespace Backend.Domain.Repositories;

public interface IAnswerRepository
{
    Task<Answer?> GetByIdAsync(Guid id, CancellationToken cancellationToken = default);

    Task<IEnumerable<Answer>> GetAllByQuestionIdAsync(Guid questionId, CancellationToken cancellationToken = default);

    Task<Answer> AddAsync(Answer answer, CancellationToken cancellationToken = default);

    Task Update(Answer answer, CancellationToken cancellationToken = default);

    Task Delete(Answer answer, CancellationToken cancellationToken = default);

    Task<bool> ExistsAsync(Guid id, CancellationToken cancellationToken = default);

    Task<int> GetLikesCountAsync(Guid answerId, CancellationToken cancellationToken = default);

    Task<bool> UserLikedAsync(Guid userId, Guid answerId, CancellationToken cancellationToken = default);

    Task AddLikeAsync(AnswerLike like, CancellationToken cancellationToken = default);

    Task RemoveLikeAsync(Guid userId, Guid answerId, CancellationToken cancellationToken = default);
}